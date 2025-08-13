// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';

// GET /api/analytics/product-usage
// Returns detailed product usage analytics for the current user
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

    // Get AI requests grouped by product
    const aiRequests = await prisma.aIRequest.groupBy({
      by: ['productId'],
      where: {
        userId: user.userId,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      },
      _avg: {
        processingTimeMs: true
      },
      _sum: {
        inputTokens: true,
        outputTokens: true
      }
    });

    // Get success rates per product
    const successRates = await Promise.all(
      aiRequests.map(async (req) => {
        const total = await prisma.aIRequest.count({
          where: {
            userId: user.userId,
            productId: req.productId,
            createdAt: { gte: startDate }
          }
        });

        const successful = await prisma.aIRequest.count({
          where: {
            userId: user.userId,
            productId: req.productId,
            success: true,
            createdAt: { gte: startDate }
          }
        });

        return {
          productId: req.productId,
          successRate: total > 0 ? (successful / total) * 100 : 0
        };
      })
    );

    // Map product IDs to friendly names
    const productNames: { [key: string]: string } = {
      'novus-protocol': 'NOVUS Protocol',
      'content-spawner': 'Content Spawner',
      'bundle-builder': 'Bundle Builder',
      'auto-rewrite': 'Auto Rewrite',
      'live-dashboard': 'Live Dashboard',
      'affiliate-portal': 'Affiliate Portal'
    };

    // Combine the data
    const productUsage = aiRequests.map(req => {
      const successRate = successRates.find(s => s.productId === req.productId)?.successRate || 0;
      
      return {
        productId: req.productId,
        name: productNames[req.productId] || req.productId,
        requests: req._count.id,
        avgResponseTime: Math.round((req._avg.processingTimeMs || 0) / 1000 * 10) / 10,
        totalTokens: (req._sum.inputTokens || 0) + (req._sum.outputTokens || 0),
        successRate: Math.round(successRate * 10) / 10
      };
    });

    // Calculate total requests for percentages
    const totalRequests = productUsage.reduce((sum, product) => sum + product.requests, 0);
    
    const productUsageWithPercentages = productUsage
      .map(product => ({
        ...product,
        percentage: totalRequests > 0 ? Math.round((product.requests / totalRequests) * 100 * 10) / 10 : 0
      }))
      .sort((a, b) => b.requests - a.requests);

    // Get daily breakdown
    const dailyUsage = await prisma.aIRequest.groupBy({
      by: ['createdAt'],
      where: {
        userId: user.userId,
        createdAt: { gte: startDate }
      },
      _count: {
        id: true
      }
    });

    // Group by day
    const dailyStats: { [key: string]: number } = {};
    dailyUsage.forEach(day => {
      const dateStr = day.createdAt.toISOString().split('T')[0];
      dailyStats[dateStr] = (dailyStats[dateStr] || 0) + day._count.id;
    });

    return NextResponse.json({
      success: true,
      data: {
        range,
        productUsage: productUsageWithPercentages,
        dailyStats,
        summary: {
          totalRequests,
          totalProducts: productUsageWithPercentages.length,
          mostUsedProduct: productUsageWithPercentages[0]?.name || 'None',
          avgSuccessRate: productUsageWithPercentages.length > 0 
            ? Math.round(productUsageWithPercentages.reduce((sum, p) => sum + p.successRate, 0) / productUsageWithPercentages.length * 10) / 10
            : 0
        }
      }
    });

  } catch (error: any) {
    console.error('Product usage analytics error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'PRODUCT_USAGE_ERROR', 
          message: 'Failed to fetch product usage analytics' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `analytics-product-usage:${userId}:${ip}`;
  }
}));