// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

// GET /api/analytics/revenue?range=30d
// Returns simple revenue summary for the user
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

    const payments = await prisma.payment.findMany({
      where: { userId: user.userId, createdAt: { gte: startDate }, status: 'SUCCEEDED' },
      orderBy: { createdAt: 'desc' }
    });

    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        range,
        totalRevenue,
        payments: payments.map(p => ({ id: p.id, amount: p.amount, currency: p.currency, createdAt: p.createdAt, plan: p.plan, productName: p.productName }))
      }
    });
  } catch (error: any) {
    console.error('Revenue analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVENUE_ANALYTICS_ERROR', message: 'Failed to fetch revenue analytics' } },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-revenue:${userId}:${ip}`;
  }
}));

