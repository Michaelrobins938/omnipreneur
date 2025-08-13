// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const CaptureSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  source: z.string().default('form'),
  tags: z.array(z.string()).default([])
});

export const POST = requireEntitlement('lead-generation-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { name, email, source, tags } = CaptureSchema.parse(body);

    const record = await prisma.event.create({
      data: {
        userId: user.userId,
        event: 'lead_captured',
        metadata: { name, email, source, tags }
      }
    });

    return NextResponse.json({ success: true, data: { id: record.id } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    console.error('Lead capture error:', error);
    return NextResponse.json({ success: false, error: { code: 'CAPTURE_ERROR', message: 'Failed to capture lead' } }, { status: 500 });
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `leads-capture:${userId}:${ip}`;
  }
}));

