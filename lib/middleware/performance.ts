// Performance monitoring and optimization middleware
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Redis from 'ioredis';

interface PerformanceMetrics {
  requestId: string;
  method: string;
  path: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  statusCode?: number;
  userId?: string;
  userAgent?: string;
  ip?: string;
  cacheHit?: boolean;
  dbQueries?: number;
  memoryUsage?: NodeJS.MemoryUsage;
}

class PerformanceMonitor {
  public redis: Redis | null = null;
  public metrics: Map<string, PerformanceMetrics> = new Map();
  
  constructor() {
    // Initialize Redis if available
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL);
    }
  }

  startRequest(request: NextRequest): string {
    const requestId = this.generateRequestId();
    const path = new URL(request.url).pathname;
    
    const metrics: PerformanceMetrics = {
      requestId,
      method: request.method,
      path,
      startTime: Date.now(),
      userAgent: request.headers.get('user-agent') || undefined,
      ip: this.getClientIP(request),
      memoryUsage: process.memoryUsage()
    };

    this.metrics.set(requestId, metrics);
    return requestId;
  }

  endRequest(requestId: string, response: NextResponse, userId?: string) {
    const metrics = this.metrics.get(requestId);
    if (!metrics) return;

    metrics.endTime = Date.now();
    metrics.duration = metrics.endTime - metrics.startTime;
    metrics.statusCode = response.status;
    metrics.userId = userId;

    // Log if request is slow
    if (metrics.duration > 1000) {
      console.warn(`Slow request detected: ${metrics.method} ${metrics.path} - ${metrics.duration}ms`);
    }

    // Store metrics
    this.storeMetrics(metrics);
    
    // Cleanup
    this.metrics.delete(requestId);
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    return cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  }

  private async storeMetrics(metrics: PerformanceMetrics) {
    try {
      if (this.redis) {
        // Store in Redis with 24h expiration
        await this.redis.setex(
          `perf:${metrics.requestId}`, 
          86400, 
          JSON.stringify(metrics)
        );

        // Add to hourly aggregation
        const hourKey = `perf_hour:${new Date().toISOString().slice(0, 13)}`;
        await this.redis.lpush(hourKey, JSON.stringify(metrics));
        await this.redis.expire(hourKey, 86400);
      }

      // Store critical metrics in memory for quick access
      this.updateAggregatedMetrics(metrics);
      
    } catch (error) {
      console.error('Failed to store performance metrics:', error);
    }
  }

  private updateAggregatedMetrics(metrics: PerformanceMetrics) {
    // Update in-memory aggregations for quick dashboard access
    // This could be expanded based on specific needs
  }

  async getMetrics(hours: number = 1): Promise<PerformanceMetrics[]> {
    if (!this.redis) return [];

    try {
      const keys = [];
      const now = new Date();
      
      for (let i = 0; i < hours; i++) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        keys.push(`perf_hour:${hour.toISOString().slice(0, 13)}`);
      }

      const results = await Promise.all(
        keys.map(key => this.redis!.lrange(key, 0, -1))
      );

      return results
        .flat()
        .map(data => JSON.parse(data))
        .sort((a, b) => b.startTime - a.startTime);
        
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      return [];
    }
  }

  async getAggregatedStats(hours: number = 24) {
    const metrics = await this.getMetrics(hours);
    
    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        errorRate: 0,
        topEndpoints: [],
        hourlyBreakdown: []
      };
    }

    const totalRequests = metrics.length;
    const averageResponseTime = metrics.reduce((sum, m) => sum + (m.duration || 0), 0) / totalRequests;
    const slowRequests = metrics.filter(m => (m.duration || 0) > 1000).length;
    const errorRequests = metrics.filter(m => (m.statusCode || 0) >= 400).length;
    const errorRate = (errorRequests / totalRequests) * 100;

    // Top endpoints by request count
    const endpointCounts = metrics.reduce((acc, m) => {
      acc[m.path] = (acc[m.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEndpoints = Object.entries(endpointCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));

    // Hourly breakdown
    const hourlyBreakdown = this.getHourlyBreakdown(metrics, hours);

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime),
      slowRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      topEndpoints,
      hourlyBreakdown
    };
  }

  private getHourlyBreakdown(metrics: PerformanceMetrics[], hours: number) {
    const breakdown = [];
    const now = new Date();

    for (let i = hours - 1; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStart = hour.getTime();
      const hourEnd = hourStart + 60 * 60 * 1000;

      const hourMetrics = metrics.filter(m => 
        m.startTime >= hourStart && m.startTime < hourEnd
      );

      breakdown.push({
        hour: hour.toISOString().slice(0, 13) + ':00',
        requests: hourMetrics.length,
        averageResponseTime: hourMetrics.length > 0 
          ? Math.round(hourMetrics.reduce((sum, m) => sum + (m.duration || 0), 0) / hourMetrics.length)
          : 0,
        errors: hourMetrics.filter(m => (m.statusCode || 0) >= 400).length
      });
    }

    return breakdown;
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Middleware wrapper
export function withPerformanceMonitoring<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const requestId = performanceMonitor.startRequest(request);
    
    try {
      const response = await handler(request, ...args);
      
      // Extract user ID if available from the response or request
      const userId = (request as any).user?.userId;
      
      performanceMonitor.endRequest(requestId, response, userId);
      
      // Add performance headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${Date.now() - performanceMonitor.metrics.get(requestId)?.startTime || 0}ms`);
      
      return response;
      
    } catch (error) {
      // Create error response
      const errorResponse = NextResponse.json(
        { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
        { status: 500 }
      );
      
      performanceMonitor.endRequest(requestId, errorResponse);
      throw error;
    }
  };
}

// Cache middleware for GET requests
export function withCaching(ttl: number = 300) { // 5 minutes default
  return function<T extends any[]>(
    handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
      // Only cache GET requests
      if (request.method !== 'GET') {
        return handler(request, ...args);
      }

      const cacheKey = `cache:${new URL(request.url).pathname}:${new URL(request.url).search}`;
      
      try {
        if (performanceMonitor.redis) {
          const cached = await performanceMonitor.redis.get(cacheKey);
          if (cached) {
            const response = new NextResponse(cached);
            response.headers.set('X-Cache', 'HIT');
            return response;
          }
        }

        const response = await handler(request, ...args);
        
        // Cache successful responses
        if (response.status === 200 && performanceMonitor.redis) {
          const responseText = await response.clone().text();
          await performanceMonitor.redis.setex(cacheKey, ttl, responseText);
        }

        response.headers.set('X-Cache', 'MISS');
        return response;
        
      } catch (error) {
        // Fallback to non-cached response
        return handler(request, ...args);
      }
    };
  };
}

// Rate limiting with Redis
export function withAdvancedRateLimit(options: {
  windowMs: number;
  max: number;
  keyGenerator?: (request: NextRequest) => string;
}) {
  return function<T extends any[]>(
    handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
      if (!performanceMonitor.redis) {
        return handler(request, ...args);
      }

      const key = options.keyGenerator 
        ? options.keyGenerator(request)
        : performanceMonitor.getClientIP(request);
        
      const rateLimitKey = `rate_limit:${key}`;
      
      try {
        const current = await performanceMonitor.redis.incr(rateLimitKey);
        
        if (current === 1) {
          await performanceMonitor.redis.expire(rateLimitKey, Math.ceil(options.windowMs / 1000));
        }
        
        if (current > options.max) {
          return NextResponse.json(
            { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
            { status: 429 }
          );
        }

        const response = await handler(request, ...args);
        response.headers.set('X-RateLimit-Limit', options.max.toString());
        response.headers.set('X-RateLimit-Remaining', Math.max(0, options.max - current).toString());
        
        return response;
        
      } catch (error) {
        // Fallback to allowing request if Redis fails
        return handler(request, ...args);
      }
    };
  };
}

export { performanceMonitor };

// Export API endpoint for performance metrics
export async function getPerformanceMetrics(hours: number = 24) {
  return performanceMonitor.getAggregatedStats(hours);
}