// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { generateInsights } from '@/lib/ai/analytics-engine';

export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const insights = await generateInsights(user.id);
    return NextResponse.json({ success: true, data: insights });
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json({ success: false, error: { code: 'INSIGHTS_ERROR', message: 'Failed to generate insights' } }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.id || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-insights:${userId}:${ip}`;
  }
}));

