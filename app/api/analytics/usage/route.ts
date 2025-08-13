// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

// GET /api/analytics/usage
// Returns usage metrics for the current user with optional time range
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') || '30d').toLowerCase();

    const now = new Date();
    const startDate = (() => {
      switch (range) {
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case '1y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    })();

    // LIGHTWEIGHT MODE: Reduce query load
    const usage = await prisma.usage.findUnique({ where: { userId: user.userId } });
    
    // Only fetch recent events (limit 10 instead of 200)
    const events = await prisma.event.findMany({
      where: { userId: user.userId, timestamp: { gte: startDate } },
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    return NextResponse.json({
      success: true,
      data: {
        range,
        usage: usage || null,
        activity: events.map(e => ({ id: e.id, event: e.event, timestamp: e.timestamp, metadata: e.metadata }))
      }
    });
  } catch (error: any) {
    console.error('Usage analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'USAGE_ANALYTICS_ERROR', message: 'Failed to fetch usage analytics' } },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-usage:${userId}:${ip}`;
  }
}));

