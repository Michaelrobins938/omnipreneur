// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';
import { withRateLimit } from '@/lib/rate-limit';
import { chatComplete } from '@/lib/ai/openai';
import { logAIRequest } from '@/lib/db';

// GET /api/admin/analytics
// Admin-only endpoint for comprehensive analytics
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { role: true }
    });
    
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const includeAI = searchParams.get('includeAI') === 'true';
    
    // Calculate date range
    const now = new Date();
    const startDate = (() => {
      switch (period) {
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case '1y': return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
    })();
    
    // Gather comprehensive analytics
    const [
      userStats,
      revenueStats,
      productUsage,
      aiRequestStats,
      subscriptionStats,
      contentStats
    ] = await Promise.all([
      // User statistics
      prisma.user.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: startDate } },
        _count: { id: true }
      }),
      
      // Revenue statistics
      prisma.payment.aggregate({
        where: { createdAt: { gte: startDate }, status: 'SUCCEEDED' },
        _sum: { amount: true },
        _count: { id: true },
        _avg: { amount: true }
      }),
      
      // Product usage by type
      prisma.aIRequest.groupBy({
        by: ['productId'],
        where: { createdAt: { gte: startDate } },
        _count: { id: true },
        _avg: { processingTimeMs: true }
      }),
      
      // AI request statistics
      prisma.aIRequest.aggregate({
        where: { createdAt: { gte: startDate } },
        _count: { id: true },
        _sum: { inputTokens: true, outputTokens: true },
        _avg: { processingTimeMs: true }
      }),
      
      // Subscription distribution
      prisma.subscription.groupBy({
        by: ['plan', 'status'],
        _count: { id: true }
      }),
      
      // Content creation stats
      prisma.contentPiece.groupBy({
        by: ['contentType'],
        where: { createdAt: { gte: startDate } },
        _count: { id: true }
      })
    ]);
    
    // Calculate growth metrics
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: {
        events: {
          some: {
            timestamp: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
          }
        }
      }
    });
    
    const analytics = {
      period,
      overview: {
        totalUsers,
        activeUsers,
        activeUserRate: totalUsers > 0 ? (activeUsers / totalUsers * 100).toFixed(2) + '%' : '0%',
        newUsers: userStats.reduce((sum, day) => sum + day._count.id, 0),
        totalRevenue: revenueStats._sum.amount || 0,
        totalTransactions: revenueStats._count.id || 0,
        avgTransactionValue: revenueStats._avg.amount || 0
      },
      aiUsage: {
        totalRequests: aiRequestStats._count.id || 0,
        totalTokens: (aiRequestStats._sum.inputTokens || 0) + (aiRequestStats._sum.outputTokens || 0),
        avgProcessingTime: Math.round(aiRequestStats._avg.processingTimeMs || 0) + 'ms',
        byProduct: productUsage.map(p => ({
          productId: p.productId,
          requests: p._count.id,
          avgTime: Math.round(p._avg.processingTimeMs || 0) + 'ms'
        }))
      },
      subscriptions: {
        distribution: subscriptionStats.reduce((acc, s) => {
          const key = `${s.plan}_${s.status}`;
          acc[key] = s._count.id;
          return acc;
        }, {} as Record<string, number>)
      },
      content: {
        byType: contentStats.reduce((acc, c) => {
          acc[c.contentType] = c._count.id;
          return acc;
        }, {} as Record<string, number>)
      }
    };
    
    // Generate AI insights if requested
    if (includeAI) {
      try {
        const t0 = Date.now();
        const prompt = `Analyze these admin metrics and provide strategic insights:
        
        Period: ${period}
        Total Users: ${totalUsers}
        Active Users: ${activeUsers} (${analytics.overview.activeUserRate})
        Revenue: $${analytics.overview.totalRevenue.toLocaleString()}
        AI Requests: ${analytics.aiUsage.totalRequests}
        Avg Processing: ${analytics.aiUsage.avgProcessingTime}
        
        Provide 3-5 strategic recommendations for platform growth and optimization.
        Format as JSON with keys: insights[], warnings[], opportunities[]`;
        
        const response = await chatComplete({
          system: 'You are a SaaS platform analytics expert. Provide actionable strategic insights.',
          user: prompt,
          temperature: 0.3,
          maxTokens: 500
        });
        
        if (response) {
          try {
            const aiInsights = JSON.parse(response);
            analytics.aiInsights = aiInsights;
          } catch (parseError) {
            console.error('Failed to parse AI insights:', parseError);
          }
        }
        
        await logAIRequest({
          userId: user.userId,
          productId: 'admin-analytics',
          modelUsed: process.env['DEFAULT_AI_MODEL'] || 'gpt-4o-mini',
          processingTimeMs: Date.now() - t0,
          success: true,
          inputData: { period, metrics: analytics },
          outputData: analytics.aiInsights
        });
      } catch (error) {
        console.error('AI insights generation failed:', error);
      }
    }
    
    return NextResponse.json({ success: true, data: analytics });
    
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ANALYTICS_ERROR', message: 'Failed to fetch admin analytics' } },
      { status: 500 }
    );
  }
}, {
  limit: 10,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    return `admin-analytics:${userId}`;
  }
}));