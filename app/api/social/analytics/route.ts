// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { analyzeSocialPerformance } from '@/lib/social/analyzer';

const AnalyticsSchema = z.object({ platform: z.enum(['facebook','instagram','twitter','linkedin','tiktok','youtube']) });

export const POST = requireEntitlement('social-media-manager')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { platform } = AnalyticsSchema.parse(body);
    const insights = analyzeSocialPerformance(platform);
    return NextResponse.json({ success: true, data: insights });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'SOCIAL_ANALYTICS_ERROR', message: 'Failed to analyze social performance' } }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 5 * 60 * 1000,
  key: (_req: NextRequest) => `social-analytics`
}));

