import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/admin/monitoring/health
 * Get system health metrics
 */
export const GET = requireAuth(async (request: NextRequest) => {
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

    // Check database health
    const dbStart = Date.now();
    const dbTest = await prisma.user.findFirst({ select: { id: true } });
    const dbResponseTime = Date.now() - dbStart;

    // Get database connection info (approximate)
    const dbConnections = Math.floor(Math.random() * 10) + 5; // Mock value

    // Get API performance metrics
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [totalRequests, errorRequests] = await Promise.all([
      prisma.aIRequest.count({
        where: { createdAt: { gte: twentyFourHoursAgo } }
      }),
      prisma.aIRequest.count({
        where: { 
          createdAt: { gte: twentyFourHoursAgo },
          success: false 
        }
      })
    ]);

    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
    const requestsPerMinute = Math.round(totalRequests / (24 * 60));

    // Get average response time
    const avgResponseTime = await prisma.aIRequest.aggregate({
      where: { 
        createdAt: { gte: twentyFourHoursAgo },
        processingTimeMs: { not: null }
      },
      _avg: { processingTimeMs: true }
    });

    // Mock memory usage (in production, use actual system metrics)
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external;
    const usedMemory = memoryUsage.heapUsed;
    const memoryPercentage = (usedMemory / totalMemory) * 100;

    // Calculate uptime (mock value - in production, track actual uptime)
    const uptime = process.uptime();

    // Determine overall system status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (errorRate > 10 || memoryPercentage > 90 || dbResponseTime > 1000) {
      status = 'critical';
    } else if (errorRate > 5 || memoryPercentage > 75 || dbResponseTime > 500) {
      status = 'warning';
    }

    const healthData = {
      status,
      database: {
        connected: !!dbTest,
        responseTime: dbResponseTime,
        connections: dbConnections
      },
      api: {
        responseTime: avgResponseTime._avg.processingTimeMs || 0,
        errorRate,
        requestsPerMinute
      },
      memory: {
        usage: usedMemory,
        total: totalMemory,
        percentage: memoryPercentage
      },
      uptime: Math.floor(uptime)
    };

    return NextResponse.json({
      success: true,
      data: healthData
    });

  } catch (error: any) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      success: true,
      data: {
        status: 'critical',
        database: {
          connected: false,
          responseTime: 0,
          connections: 0
        },
        api: {
          responseTime: 0,
          errorRate: 100,
          requestsPerMinute: 0
        },
        memory: {
          usage: 0,
          total: 0,
          percentage: 0
        },
        uptime: 0
      }
    });
  }
});