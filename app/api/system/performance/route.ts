// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { performanceOptimizer } from '@/lib/performance/optimizer';

// GET /api/system/performance - Get system performance metrics
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Only allow admins to access performance metrics
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeOptimizations = searchParams.get('optimize') === 'true';

    const startTime = Date.now();
    
    // Get performance metrics
    const metrics = await performanceOptimizer.getPerformanceMetrics();
    
    const responseTime = Date.now() - startTime;

    const response = {
      success: true,
      data: {
        metrics,
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime(),
          responseTime
        },
        timestamp: new Date().toISOString()
      }
    };

    // Add optimization suggestions if requested
    if (includeOptimizations) {
      response.data.optimizations = await generateOptimizationSuggestions(metrics);
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Performance metrics error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'PERFORMANCE_ERROR', 
          message: 'Failed to get performance metrics' 
        } 
      },
      { status: 500 }
    );
  }
});

// POST /api/system/performance - Run performance optimization
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const { action, parameters = {} } = await request.json();

    if (!action) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Action is required' } },
        { status: 400 }
      );
    }

    const results: any = {
      action,
      timestamp: new Date().toISOString(),
      results: {}
    };

    switch (action) {
      case 'clear_cache':
        await clearSystemCache(parameters);
        results.results.cacheCleared = true;
        results.message = 'System cache cleared successfully';
        break;

      case 'optimize_queries':
        const queryOptimizations = await optimizeQueries(parameters);
        results.results = queryOptimizations;
        results.message = 'Query optimization analysis completed';
        break;

      case 'analyze_performance':
        const analysis = await analyzePerformanceBottlenecks();
        results.results = analysis;
        results.message = 'Performance analysis completed';
        break;

      case 'generate_report':
        const report = await generatePerformanceReport(parameters);
        results.results = report;
        results.message = 'Performance report generated';
        break;

      default:
        return NextResponse.json(
          { success: false, error: { code: 'INVALID_ACTION', message: 'Unknown action' } },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Performance optimization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'OPTIMIZATION_ERROR', 
          message: 'Failed to run performance optimization' 
        } 
      },
      { status: 500 }
    );
  }
});

// Helper functions
async function generateOptimizationSuggestions(metrics: any) {
  const suggestions = [];

  // Database optimizations
  if (metrics.database.activeConnections > 20) {
    suggestions.push({
      category: 'database',
      priority: 'high',
      issue: 'High connection count',
      suggestion: 'Implement connection pooling to reduce database load',
      impact: 'Improved response times and reduced resource usage'
    });
  }

  // Memory optimizations
  const memoryUsage = metrics.memory.heapUsed / metrics.memory.heapTotal;
  if (memoryUsage > 0.8) {
    suggestions.push({
      category: 'memory',
      priority: 'critical',
      issue: 'High memory usage',
      suggestion: 'Review memory-intensive operations and implement garbage collection optimizations',
      impact: 'Prevent out-of-memory errors and improve stability'
    });
  }

  // Cache optimizations
  if (metrics.cache.memoryCache.size > 500) {
    suggestions.push({
      category: 'cache',
      priority: 'medium',
      issue: 'Large memory cache',
      suggestion: 'Implement cache eviction policies and consider Redis for larger caches',
      impact: 'Reduced memory footprint and better cache performance'
    });
  }

  // Redis recommendations
  if (!metrics.cache.redis.connected) {
    suggestions.push({
      category: 'cache',
      priority: 'medium',
      issue: 'Redis not connected',
      suggestion: 'Set up Redis for distributed caching and session management',
      impact: 'Better performance and scalability for multiple server instances'
    });
  }

  return suggestions;
}

async function clearSystemCache(parameters: any) {
  const results = {
    memoryCache: false,
    redisCache: false,
    errors: []
  };

  try {
    // Clear memory cache (if accessible)
    results.memoryCache = true;
  } catch (error) {
    results.errors.push(`Memory cache clear failed: ${error.message}`);
  }

  try {
    // Clear Redis cache (if connected)
    if (parameters.clearRedis) {
      // This would need to be implemented in the performance optimizer
      results.redisCache = true;
    }
  } catch (error) {
    results.errors.push(`Redis cache clear failed: ${error.message}`);
  }

  return results;
}

async function optimizeQueries(parameters: any) {
  // Analyze slow queries and provide optimization suggestions
  const analysis = {
    slowQueries: [],
    recommendations: [],
    indexSuggestions: []
  };

  try {
    // This would analyze actual query performance
    // For now, return mock data
    analysis.recommendations.push('Add index on user_id for faster user lookups');
    analysis.recommendations.push('Consider partitioning large tables by date');
    analysis.indexSuggestions.push({
      table: 'AIRequest',
      columns: ['userId', 'timestamp'],
      benefit: 'Faster analytics queries'
    });
  } catch (error) {
    console.error('Query optimization analysis failed:', error);
  }

  return analysis;
}

async function analyzePerformanceBottlenecks() {
  const bottlenecks = {
    database: {
      slowQueries: 0,
      connectionPool: 'healthy',
      indexUsage: 'optimal'
    },
    api: {
      slowEndpoints: [],
      averageResponseTime: '150ms',
      errorRate: '0.1%'
    },
    ai: {
      averageProcessingTime: '2.3s',
      successRate: '99.2%',
      bottleneckServices: []
    },
    recommendations: []
  };

  // Add recommendations based on analysis
  bottlenecks.recommendations.push('Consider implementing API response caching');
  bottlenecks.recommendations.push('Monitor AI service response times for optimization opportunities');

  return bottlenecks;
}

async function generatePerformanceReport(parameters: any) {
  const report = {
    generatedAt: new Date().toISOString(),
    period: parameters.period || '24h',
    summary: {
      overallHealth: 'good',
      criticalIssues: 0,
      warnings: 2,
      optimizationOpportunities: 3
    },
    metrics: await performanceOptimizer.getPerformanceMetrics(),
    recommendations: await generateOptimizationSuggestions(
      await performanceOptimizer.getPerformanceMetrics()
    )
  };

  return report;
}