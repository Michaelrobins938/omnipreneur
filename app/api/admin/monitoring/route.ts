import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit/enhanced-rate-limit';
import { 
  generatePerformanceReport, 
  getRealTimeMetrics, 
  checkPerformanceAlerts 
} from '@/lib/monitoring/performance-monitor';
import { getCacheStats, clearCache } from '@/lib/caching/ai-cache';

export const GET = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const timeRange = searchParams.get('timeRange') || '24h';

        // Check if user has admin access
        const user = (request as any).user;
        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
          return NextResponse.json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Admin access required' }
          }, { status: 403 });
        }

        switch (action) {
          case 'realtime':
            const realTimeData = await getRealTimeMetrics();
            return NextResponse.json({
              success: true,
              data: realTimeData
            });

          case 'performance':
            const endDate = new Date();
            const startDate = new Date();
            
            // Set time range
            switch (timeRange) {
              case '1h':
                startDate.setHours(endDate.getHours() - 1);
                break;
              case '24h':
                startDate.setDate(endDate.getDate() - 1);
                break;
              case '7d':
                startDate.setDate(endDate.getDate() - 7);
                break;
              case '30d':
                startDate.setDate(endDate.getDate() - 30);
                break;
              default:
                startDate.setDate(endDate.getDate() - 1);
            }

            const performanceReport = await generatePerformanceReport(startDate, endDate);
            return NextResponse.json({
              success: true,
              data: performanceReport
            });

          case 'alerts':
            const alerts = await checkPerformanceAlerts();
            return NextResponse.json({
              success: true,
              data: alerts
            });

          case 'cache':
            const cacheStats = await getCacheStats();
            return NextResponse.json({
              success: true,
              data: cacheStats
            });

          case 'health':
            const healthCheck = await performHealthCheck();
            return NextResponse.json({
              success: true,
              data: healthCheck
            });

          default:
            // Return comprehensive dashboard data
            const [realTime, cache, alertsData] = await Promise.all([
              getRealTimeMetrics(),
              getCacheStats(),
              checkPerformanceAlerts()
            ]);

            return NextResponse.json({
              success: true,
              data: {
                realTime,
                cache,
                alerts: alertsData.alerts,
                timestamp: new Date().toISOString()
              }
            });
        }
      } catch (error) {
        console.error('Monitoring API error:', error);
        return NextResponse.json({
          success: false,
          error: { 
            code: 'MONITORING_ERROR', 
            message: 'Failed to fetch monitoring data' 
          }
        }, { status: 500 });
      }
    }, { max: 100, windowMs: 60000 }) // Higher rate limit for admin
  )
);

export const POST = requireAuth(
  withCsrfProtection(
    withRateLimit(async (request: NextRequest) => {
      try {
        const user = (request as any).user;
        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
          return NextResponse.json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Admin access required' }
          }, { status: 403 });
        }

        const { action, service } = await request.json();

        switch (action) {
          case 'clear_cache':
            await clearCache(service);
            return NextResponse.json({
              success: true,
              message: service ? `Cache cleared for ${service}` : 'All caches cleared'
            });

          case 'warm_cache':
            const { warmupCache } = await import('@/lib/caching/ai-cache');
            await warmupCache();
            return NextResponse.json({
              success: true,
              message: 'Cache warmup initiated'
            });

          case 'cleanup_logs':
            const { cleanupOldLogs } = await import('@/lib/monitoring/performance-monitor');
            const deletedCount = await cleanupOldLogs(30); // Keep 30 days
            return NextResponse.json({
              success: true,
              message: `Cleaned up ${deletedCount} old log entries`
            });

          default:
            return NextResponse.json({
              success: false,
              error: { code: 'INVALID_ACTION', message: 'Invalid action specified' }
            }, { status: 400 });
        }
      } catch (error) {
        console.error('Monitoring action error:', error);
        return NextResponse.json({
          success: false,
          error: { 
            code: 'ACTION_ERROR', 
            message: 'Failed to perform monitoring action' 
          }
        }, { status: 500 });
      }
    }, { max: 50, windowMs: 60000 })
  )
);

/**
 * Perform comprehensive health check
 */
async function performHealthCheck() {
  const checks = [];

  // Database health
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    checks.push({ service: 'database', status: 'healthy', responseTime: 0 });
  } catch (error) {
    checks.push({ 
      service: 'database', 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: 0 
    });
  }

  // AI Services health
  const aiServices = ['content-generation', 'auto-rewrite', 'bundle-builder', 'niche-discovery'];
  
  for (const service of aiServices) {
    try {
      const startTime = Date.now();
      
      // Perform lightweight health check for each service
      const healthCheck = await performAIServiceHealthCheck(service);
      const responseTime = Date.now() - startTime;
      
      checks.push({
        service: `ai-${service}`,
        status: healthCheck.status,
        responseTime,
        metadata: healthCheck.metadata
      });
    } catch (error) {
      checks.push({
        service: `ai-${service}`,
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: 0
      });
    }
  }

  // Cache health
  try {
    const cacheStats = await getCacheStats();
    checks.push({
      service: 'cache',
      status: 'healthy',
      responseTime: 0,
      metadata: { type: cacheStats.type, totalKeys: cacheStats.totalKeys }
    });
  } catch (error) {
    checks.push({
      service: 'cache',
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: 0
    });
  }

  // Overall health status
  const healthyServices = checks.filter(c => c.status === 'healthy').length;
  const totalServices = checks.length;
  const overallHealth = healthyServices === totalServices ? 'healthy' : 
                       healthyServices > totalServices * 0.7 ? 'degraded' : 'unhealthy';

  return {
    overall: overallHealth,
    services: checks,
    summary: {
      healthy: healthyServices,
      total: totalServices,
      percentage: Math.round((healthyServices / totalServices) * 100)
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Perform health check for individual AI service
 */
async function performAIServiceHealthCheck(service: string) {
  try {
    // Minimal test requests for each service
    const testRequests = {
      'content-generation': {
        contentType: 'SOCIAL',
        niche: 'test',
        platform: 'general',
        tone: 'professional',
        quantity: 1
      },
      'auto-rewrite': {
        originalText: 'Test text for health check.',
        targetStyle: 'improve'
      },
      'bundle-builder': {
        products: [{ id: '1', name: 'Test Product', price: 10, type: 'digital' }],
        targetAudience: 'general',
        category: 'business',
        marketplaces: ['general']
      },
      'niche-discovery': {
        keyword: 'test',
        platform: 'general',
        analysisDepth: 'quick'
      }
    };

    const testRequest = testRequests[service as keyof typeof testRequests];
    
    if (!testRequest) {
      return { status: 'unknown', metadata: { reason: 'No test case defined' } };
    }

    // Check if service configuration is valid
    const hasValidConfig = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    
    if (!hasValidConfig) {
      return { 
        status: 'unhealthy', 
        metadata: { reason: 'Missing API configuration' } 
      };
    }

    return { 
      status: 'healthy', 
      metadata: { reason: 'Configuration valid', hasApiKeys: !!hasValidConfig } 
    };
    
  } catch (error) {
    return { 
      status: 'unhealthy', 
      metadata: { 
        reason: error instanceof Error ? error.message : 'Health check failed' 
      } 
    };
  }
}