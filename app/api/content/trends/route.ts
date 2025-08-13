// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireEntitlement } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { analyzeTrends } from '@/lib/ai/trend-analyzer';

const TrendsSchema = z.object({
  niche: z.string().min(2),
  platform: z.enum(['facebook','instagram','twitter','linkedin','tiktok','youtube','general']).default('general')
});

export const POST = requireEntitlement('content-spawner')(withRateLimit(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { niche, platform } = TrendsSchema.parse(body);

    const data = await analyzeTrends(niche, platform);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: error.errors } }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: { code: 'TRENDS_ERROR', message: 'Failed to analyze trends' } }, { status: 500 });
  }
}, {
  limit: 20,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `content-trends:${userId}:${ip}`;
  }
}));

