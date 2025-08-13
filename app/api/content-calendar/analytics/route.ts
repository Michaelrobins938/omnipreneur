// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const AnalyticsSchema = z.object({
  posts: z.array(z.object({ impressions: z.number().min(0), engagements: z.number().min(0) })).min(1)
});

export const POST = requireEntitlement('content-calendar-pro')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { posts } = AnalyticsSchema.parse(body);
    const totalImpressions = posts.reduce((s, p) => s + p.impressions, 0);
    const totalEngagements = posts.reduce((s, p) => s + p.engagements, 0);
    const engagementRate = totalImpressions ? Math.round((totalEngagements / totalImpressions) * 1000) / 10 : 0;
    return NextResponse.json({ success: true, data: { totalImpressions, totalEngagements, engagementRate } });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'CALENDAR_ANALYTICS_ERROR', message: 'Failed to compute analytics' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `content-calendar-analytics`
}));

