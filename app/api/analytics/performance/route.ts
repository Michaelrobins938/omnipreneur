// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

// GET /api/analytics/performance
// Basic performance metrics: recent content/affiliate performance summary
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);

    const [topContent, topLinks] = await Promise.all([
      prisma.contentPiece.findMany({
        where: { userId: user.userId },
        orderBy: { createdAt: 'desc' },
        take: limit
      }),
      prisma.affiliateLink.findMany({
        where: { userId: user.userId },
        orderBy: [{ revenue: 'desc' }],
        take: limit
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        topContent: topContent.map(c => ({ id: c.id, contentType: c.contentType, createdAt: c.createdAt })),
        topAffiliateLinks: topLinks.map(l => ({ linkId: l.linkId, revenue: l.revenue, clicks: l.clicks, conversions: l.conversions }))
      }
    });
  } catch (error: any) {
    console.error('Performance analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PERFORMANCE_ANALYTICS_ERROR', message: 'Failed to fetch performance analytics' } },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-performance:${userId}:${ip}`;
  }
}));

