// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { optimizeEmail } from '@/lib/email/campaign-optimizer';
import { checkDeliverability } from '@/lib/email/deliverability';

const SendSchema = z.object({
  subject: z.string().min(1),
  content: z.string().min(1),
  segment: z.string().default('all'),
  sendAt: z.string().datetime().optional()
});

export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { subject, content, segment, sendAt } = SendSchema.parse(body);

    const optimized = optimizeEmail(subject, content);
    const deliverability = checkDeliverability(optimized.subject, optimized.content);

    // Stub: enqueue email job
    const jobId = `send_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        jobId,
        segment,
        scheduledFor: sendAt || 'now',
        optimized,
        deliverability
      }
    });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'SEND_ERROR', message: 'Failed to enqueue send' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `email-send:${userId}:${ip}`;
  }
}));

