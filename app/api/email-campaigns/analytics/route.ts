// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

const AnalyticsSchema = z.object({
  campaignId: z.string().min(1)
});

export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { campaignId } = AnalyticsSchema.parse(body);
    // Simulated analytics; real impl would query provider or DB
    const data = {
      campaignId,
      sent: 3200,
      delivered: 3150,
      opens: 1350,
      clicks: 410,
      bounces: 50,
      unsubscribes: 18,
      openRate: 42.9,
      clickRate: 13.0,
      bounceRate: 1.6,
    };
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'ANALYTICS_ERROR', message: 'Failed to fetch analytics' } }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `email-analytics`
}));

