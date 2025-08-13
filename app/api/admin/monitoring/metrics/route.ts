import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { realTimeAnalytics } from '@/lib/analytics/real-time-analytics';

/**
 * GET /api/admin/monitoring/metrics
 * Get real-time system metrics for monitoring
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user is admin
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
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

    // Get real-time metrics
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const [
      activeUsers,
      recentRequests,
      recentErrors,
      averageResponseTime
    ] = await Promise.all([
      // Active users in the last hour (users with events)
      prisma.user.count({
        where: {
          events: {
            some: {
              timestamp: { gte: oneHourAgo }
            }
          }
        }
      }),
      
      // Requests in the last minute
      prisma.aIRequest.count({
        where: { createdAt: { gte: oneMinuteAgo } }
      }),
      
      // Errors in the last hour
      prisma.aIRequest.count({
        where: { 
          createdAt: { gte: oneHourAgo },
          success: false 
        }
      }),
      
      // Average response time in the last hour
      prisma.aIRequest.aggregate({
        where: { 
          createdAt: { gte: oneHourAgo },
          processingTimeMs: { not: null }
        },
        _avg: { processingTimeMs: true }
      })
    ]);

    // Calculate derived metrics
    const totalRecentRequests = await prisma.aIRequest.count({
      where: { createdAt: { gte: oneHourAgo } }
    });

    const successRate = totalRecentRequests > 0 
      ? ((totalRecentRequests - recentErrors) / totalRecentRequests) * 100
      : 100;

    const metrics = {
      activeUsers,
      requestsPerSecond: recentRequests, // Approximate requests per second from last minute
      averageResponseTime: Math.round(averageResponseTime._avg.processingTimeMs || 0),
      errorCount: recentErrors,
      successRate: Math.round(successRate * 10) / 10 // Round to 1 decimal place
    };

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      data: metrics
    });

  } catch (error: any) {
    console.error('Metrics fetch error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'METRICS_ERROR', message: 'Failed to fetch metrics' } },
      { status: 500 }
    );
  }
});