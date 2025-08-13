// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { planContent } from '@/lib/content/planner';

const PlanSchema = z.object({ niche: z.string().min(2), month: z.string().min(7), count: z.number().min(1).max(60).default(12) });

export const POST = requireEntitlement('content-calendar-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { niche, month, count } = PlanSchema.parse(body);
    const plan = planContent({ niche, month, count });
    return NextResponse.json({ success: true, data: plan });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'PLAN_ERROR', message: 'Failed to plan content' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `content-calendar-plan`
}));

