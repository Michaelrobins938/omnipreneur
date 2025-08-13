// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { scheduleContent } from '@/lib/content/scheduler';

const ScheduleSchema = z.object({
  items: z.array(z.object({ title: z.string().min(1), platform: z.string().min(2) })).min(1),
  startDate: z.string().datetime(),
  cadenceDays: z.number().min(1).max(14).default(2)
});

export const POST = requireEntitlement('content-calendar-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { items, startDate, cadenceDays } = ScheduleSchema.parse(body);
    const schedule = scheduleContent(items, startDate, cadenceDays);
    return NextResponse.json({ success: true, data: schedule });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'SCHEDULE_ERROR', message: 'Failed to create schedule' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `content-calendar-schedule`
}));

