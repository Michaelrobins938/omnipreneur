import prisma from '@/lib/db';

export interface PerformanceMetric {
  id?: string;
  service: string;
  operation: string;
  userId?: string;
  duration: number;
  success: boolean;
  errorType?: string;
  cacheHit?: boolean;
  modelUsed?: string;
  inputSize?: number;
  outputSize?: number;
  timestamp: Date;
  metadata?: any;
}

export interface PerformanceReport {
  timeRange: { start: Date; end: Date };
  totalRequests: number;
  averageResponseTime: number;
  successRate: number;
  cacheHitRate: number;
  serviceBreakdown: Array<{
    service: string;
    requests: number;
    avgResponseTime: number;
    successRate: number;
  }>;
  errorBreakdown: Array<{
    errorType: string;
    count: number;
    percentage: number;
  }>;
  performanceTrends: Array<{
    hour: number;
    avgResponseTime: number;
    requestCount: number;
  }>;
}

/**
 * Log performance metric
 */
export async function logPerformanceMetric(metric: PerformanceMetric): Promise<void> {
  try {
    // Persist as an Event with rich metadata since Prisma PerformanceMetric schema differs
    if (!metric.userId) {
      // If no userId is provided, skip DB write to satisfy foreign key constraint
      console.warn('logPerformanceMetric: missing userId, skipping DB write');
      return;
    }
    await prisma.event.create({
      data: {
        userId: metric.userId,
        event: 'PERFORMANCE_METRIC',
        metadata: {
          service: metric.service,
          operation: metric.operation,
          duration: metric.duration,
          success: metric.success,
          errorType: metric.errorType,
          cacheHit: metric.cacheHit || false,
          modelUsed: metric.modelUsed,
          inputSize: metric.inputSize,
          outputSize: metric.outputSize
        },
        timestamp: metric.timestamp
      }
    });
  } catch (error) {
    console.error('Failed to log performance metric:', error);
    // Don't throw - monitoring should be non-blocking
  }
}

/**
 * Performance monitoring decorator
 */
export function withPerformanceMonitoring<T>(
  service: string,
  operation: string,
  userId?: string
) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<T> {
      const startTime = Date.now();
      let success = true;
      let errorType: string | undefined;
      let result: T;

      try {
        result = await method.apply(this, args);
        return result;
      } catch (error) {
        success = false;
        errorType = error instanceof Error ? error.constructor.name : 'Unknown';
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        
        // Calculate input/output sizes
        const inputSize = JSON.stringify(args[0] || {}).length;
        const outputSize = result ? JSON.stringify(result).length : 0;

        logPerformanceMetric({
          service,
          operation,
          userId,
          duration,
          success,
          errorType,
          inputSize,
          outputSize,
          timestamp: new Date(),
          metadata: {
            argsCount: args.length,
            hasResult: !!result
          }
        });
      }
    };

    return descriptor;
  };
}

/**
 * Generate performance report
 */
export async function generatePerformanceReport(
  startDate: Date,
  endDate: Date
): Promise<PerformanceReport> {
  try {
    const events = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        },
        event: 'PERFORMANCE_METRIC'
      }
    });

    const metrics = events.map(e => ({
      service: (e.metadata as any)?.service as string,
      operation: (e.metadata as any)?.operation as string,
      duration: Number((e.metadata as any)?.duration) || 0,
      success: Boolean((e.metadata as any)?.success),
      cacheHit: Boolean((e.metadata as any)?.cacheHit),
      errorType: (e.metadata as any)?.errorType as string | undefined,
      timestamp: e.timestamp
    }));

    const totalRequests = metrics.length;
    const successfulRequests = metrics.filter(m => m.success).length;
    const cacheHits = metrics.filter(m => m.cacheHit).length;
    
    const averageResponseTime = totalRequests > 0 
      ? metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests 
      : 0;
    
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;
    const cacheHitRate = totalRequests > 0 ? (cacheHits / totalRequests) * 100 : 0;

    // Service breakdown
    const serviceMap = new Map<string, any[]>();
    metrics.forEach(metric => {
      if (!serviceMap.has(metric.service)) {
        serviceMap.set(metric.service, []);
      }
      serviceMap.get(metric.service)!.push(metric);
    });

    const serviceBreakdown = Array.from(serviceMap.entries()).map(([service, serviceMetrics]) => ({
      service,
      requests: serviceMetrics.length,
      avgResponseTime: serviceMetrics.reduce((sum, m) => sum + m.duration, 0) / serviceMetrics.length,
      successRate: (serviceMetrics.filter(m => m.success).length / serviceMetrics.length) * 100
    }));

    // Error breakdown
    const errorMap = new Map<string, number>();
    metrics.filter(m => !m.success && m.errorType).forEach(metric => {
      const errorType = metric.errorType!;
      errorMap.set(errorType, (errorMap.get(errorType) || 0) + 1);
    });

    const errorBreakdown = Array.from(errorMap.entries()).map(([errorType, count]) => ({
      errorType,
      count,
      percentage: (count / totalRequests) * 100
    }));

    // Performance trends by hour
    const hourlyMap = new Map<number, { totalTime: number; count: number }>();
    metrics.forEach(metric => {
      const hour = (metric.timestamp as Date).getHours();
      if (!hourlyMap.has(hour)) {
        hourlyMap.set(hour, { totalTime: 0, count: 0 });
      }
      const hourData = hourlyMap.get(hour)!;
      hourData.totalTime += metric.duration;
      hourData.count += 1;
    });

    const performanceTrends = Array.from(hourlyMap.entries()).map(([hour, data]) => ({
      hour,
      avgResponseTime: data.totalTime / data.count,
      requestCount: data.count
    })).sort((a, b) => a.hour - b.hour);

    return {
      timeRange: { start: startDate, end: endDate },
      totalRequests,
      averageResponseTime,
      successRate,
      cacheHitRate,
      serviceBreakdown,
      errorBreakdown,
      performanceTrends
    };
  } catch (error) {
    console.error('Failed to generate performance report:', error);
    throw error;
  }
}

/**
 * Get real-time performance metrics
 */
export async function getRealTimeMetrics(): Promise<{
  currentLoad: number;
  avgResponseTimeLast5Min: number;
  errorRateLast5Min: number;
  activeServices: string[];
  cacheHitRateLast5Min: number;
}> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const recentEvents = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: fiveMinutesAgo
        },
        event: 'PERFORMANCE_METRIC'
      }
    });

    const recentMetrics = recentEvents.map(e => ({
      service: (e.metadata as any)?.service as string,
      duration: Number((e.metadata as any)?.duration) || 0,
      success: Boolean((e.metadata as any)?.success),
      cacheHit: Boolean((e.metadata as any)?.cacheHit)
    }));

    const currentLoad = recentMetrics.length;
    const avgResponseTimeLast5Min = recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length
      : 0;
    
    const errorRateLast5Min = recentMetrics.length > 0
      ? (recentMetrics.filter(m => !m.success).length / recentMetrics.length) * 100
      : 0;
    
    const cacheHitRateLast5Min = recentMetrics.length > 0
      ? (recentMetrics.filter(m => m.cacheHit).length / recentMetrics.length) * 100
      : 0;

    const activeServices = [...new Set(recentMetrics.map(m => m.service).filter(Boolean))] as string[];

    return {
      currentLoad,
      avgResponseTimeLast5Min,
      errorRateLast5Min,
      activeServices,
      cacheHitRateLast5Min
    };
  } catch (error) {
    console.error('Failed to get real-time metrics:', error);
    return {
      currentLoad: 0,
      avgResponseTimeLast5Min: 0,
      errorRateLast5Min: 0,
      activeServices: [],
      cacheHitRateLast5Min: 0
    };
  }
}

/**
 * Performance alerting
 */
export async function checkPerformanceAlerts(): Promise<{
  alerts: Array<{
    type: 'high_response_time' | 'high_error_rate' | 'low_cache_hit_rate';
    severity: 'warning' | 'critical';
    message: string;
    value: number;
    threshold: number;
  }>;
}> {
  const metrics = await getRealTimeMetrics();
  const alerts: any[] = [];

  // High response time alert
  if (metrics.avgResponseTimeLast5Min > 5000) {
    alerts.push({
      type: 'high_response_time',
      severity: metrics.avgResponseTimeLast5Min > 10000 ? 'critical' : 'warning',
      message: `Average response time is ${metrics.avgResponseTimeLast5Min.toFixed(0)}ms`,
      value: metrics.avgResponseTimeLast5Min,
      threshold: 5000
    });
  }

  // High error rate alert
  if (metrics.errorRateLast5Min > 5) {
    alerts.push({
      type: 'high_error_rate',
      severity: metrics.errorRateLast5Min > 15 ? 'critical' : 'warning',
      message: `Error rate is ${metrics.errorRateLast5Min.toFixed(1)}%`,
      value: metrics.errorRateLast5Min,
      threshold: 5
    });
  }

  // Low cache hit rate alert
  if (metrics.cacheHitRateLast5Min < 30 && metrics.currentLoad > 10) {
    alerts.push({
      type: 'low_cache_hit_rate',
      severity: metrics.cacheHitRateLast5Min < 15 ? 'critical' : 'warning',
      message: `Cache hit rate is ${metrics.cacheHitRateLast5Min.toFixed(1)}%`,
      value: metrics.cacheHitRateLast5Min,
      threshold: 30
    });
  }

  return { alerts };
}

/**
 * Clean up old performance logs
 */
export async function cleanupOldLogs(daysToKeep: number = 30): Promise<number> {
  try {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    
    const result = await prisma.event.deleteMany({
      where: {
        event: 'PERFORMANCE_METRIC',
        timestamp: {
          lt: cutoffDate
        }
      }
    });

    return result.count;
  } catch (error) {
    console.error('Failed to cleanup old logs:', error);
    return 0;
  }
}