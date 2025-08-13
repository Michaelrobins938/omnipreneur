// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const NurtureSchema = z.object({
  email: z.string().email(),
  sequence: z.enum(['welcome','reengagement','demo-followup']).default('welcome')
});

export const POST = requireEntitlement('lead-generation-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { email, sequence } = NurtureSchema.parse(body);

    // Stub: log nurture action as event
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'lead_nurture_enqueued',
        metadata: { email, sequence }
      }
    });

    return NextResponse.json({ success: true, data: { email, sequence, status: 'queued' } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'NURTURE_ERROR', message: 'Failed to enqueue nurture' } }, { status: 500 });
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `leads-nurture`
}));

