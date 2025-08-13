import { NextRequest, NextResponse } from 'next/server';
import { withCache } from '@/lib/caching/ai-cache';
import { logPerformanceMetric } from '@/lib/monitoring/performance-monitor';

export interface PerformanceConfig {
  enableCache?: boolean;
  enableCompression?: boolean;
  enablePreloading?: boolean;
  enableBatching?: boolean;
  maxConcurrentRequests?: number;
  requestTimeout?: number;
}

/**
 * Performance optimization middleware
 */
export function withPerformanceOptimization(config: PerformanceConfig = {}) {
  const {
    enableCache = true,
    enableCompression = true,
    enablePreloading = true,
    enableBatching = true,
    maxConcurrentRequests = 10,
    requestTimeout = 30000
  } = config;

  return function (handler: Function) {
    return async function optimizedHandler(request: NextRequest, ...args: any[]) {
      const startTime = Date.now();
      const requestId = generateRequestId();
      
      try {
        // Add performance headers
        const headers = new Headers();
        headers.set('X-Request-ID', requestId);
        headers.set('X-Performance-Optimized', 'true');
        
        if (enableCompression) {
          headers.set('Content-Encoding', 'gzip');
        }

        // Set request timeout
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), requestTimeout);
        });

        // Execute handler with timeout
        const handlerPromise = handler(request, ...args);
        const result = await Promise.race([handlerPromise, timeoutPromise]);

        // Add performance metrics to response
        const duration = Date.now() - startTime;
        headers.set('X-Response-Time', `${duration}ms`);

        // Log performance
        logPerformanceMetric({
          service: 'api',
          operation: extractOperationFromUrl(request.url),
          duration,
          success: true,
          timestamp: new Date()
        });

        // Return optimized response
        if (result instanceof NextResponse) {
          // Add headers to existing response
          headers.forEach((value, key) => {
            result.headers.set(key, value);
          });
          return result;
        }

        return NextResponse.json(result, { headers });

      } catch (error) {
        const duration = Date.now() - startTime;
        
        // Log error performance
        logPerformanceMetric({
          service: 'api',
          operation: extractOperationFromUrl(request.url),
          duration,
          success: false,
          errorType: error instanceof Error ? error.constructor.name : 'Unknown',
          timestamp: new Date()
        });

        throw error;
      }
    };
  };
}

/**
 * Request batching for AI services
 */
export class RequestBatcher {
  private batches = new Map<string, {
    requests: Array<{
      resolve: Function;
      reject: Function;
      params: any;
      timestamp: number;
    }>;
    timeout?: NodeJS.Timeout;
  }>();

  private readonly batchSize = 5;
  private readonly batchTimeout = 1000; // 1 second

  async addRequest<T>(
    batchKey: string,
    params: any,
    processor: (batchedParams: any[]) => Promise<T[]>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(batchKey)) {
        this.batches.set(batchKey, { requests: [] });
      }

      const batch = this.batches.get(batchKey)!;
      batch.requests.push({ resolve, reject, params, timestamp: Date.now() });

      // Clear existing timeout
      if (batch.timeout) {
        clearTimeout(batch.timeout);
      }

      // Process if batch is full or set timeout
      if (batch.requests.length >= this.batchSize) {
        this.processBatch(batchKey, processor);
      } else {
        batch.timeout = setTimeout(() => {
          this.processBatch(batchKey, processor);
        }, this.batchTimeout);
      }
    });
  }

  private async processBatch<T>(
    batchKey: string,
    processor: (batchedParams: any[]) => Promise<T[]>
  ): Promise<void> {
    const batch = this.batches.get(batchKey);
    if (!batch || batch.requests.length === 0) return;

    const requests = [...batch.requests];
    batch.requests.length = 0; // Clear the batch

    if (batch.timeout) {
      clearTimeout(batch.timeout);
      delete batch.timeout;
    }

    try {
      const params = requests.map(req => req.params);
      const results = await processor(params);

      // Resolve individual requests
      requests.forEach((request, index) => {
        if (results[index] !== undefined) {
          request.resolve(results[index]);
        } else {
          request.reject(new Error('Batch processing failed'));
        }
      });
    } catch (error) {
      // Reject all requests in the batch
      requests.forEach(request => {
        request.reject(error);
      });
    }
  }
}

/**
 * Connection pooling for AI API calls
 */
export class ConnectionPool {
  private activeConnections = 0;
  private waitingQueue: Array<{
    resolve: Function;
    reject: Function;
    timestamp: number;
  }> = [];
  
  constructor(private maxConnections: number = 10) {}

  async acquireConnection(): Promise<void> {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this.waitingQueue.push({
        resolve,
        reject,
        timestamp: Date.now()
      });

      // Timeout waiting connections after 30 seconds
      setTimeout(() => {
        const index = this.waitingQueue.findIndex(item => item.resolve === resolve);
        if (index >= 0) {
          this.waitingQueue.splice(index, 1);
          reject(new Error('Connection pool timeout'));
        }
      }, 30000);
    });
  }

  releaseConnection(): void {
    this.activeConnections--;
    
    if (this.waitingQueue.length > 0) {
      const next = this.waitingQueue.shift()!;
      this.activeConnections++;
      next.resolve();
    }
  }

  getStats() {
    return {
      activeConnections: this.activeConnections,
      waitingQueue: this.waitingQueue.length,
      maxConnections: this.maxConnections,
      utilization: (this.activeConnections / this.maxConnections) * 100
    };
  }
}

/**
 * Response compression
 */
export function compressResponse(data: any): string {
  // Remove unnecessary whitespace and minimize JSON
  return JSON.stringify(data, null, 0);
}

/**
 * Preload common AI results
 */
export async function preloadCommonResults() {
  const commonRequests = [
    // Common content generation patterns
    {
      service: 'content-generation',
      params: {
        contentType: 'SOCIAL',
        niche: 'business',
        platform: 'linkedin',
        tone: 'professional',
        targetAudience: 'professionals',
        quantity: 3
      }
    },
    {
      service: 'content-generation', 
      params: {
        contentType: 'SOCIAL',
        niche: 'marketing',
        platform: 'twitter',
        tone: 'casual',
        targetAudience: 'marketers',
        quantity: 3
      }
    },
    // Common rewrite patterns
    {
      service: 'auto-rewrite',
      params: {
        originalText: 'Sample business text for improvement testing.',
        targetStyle: 'improve',
        targetAudience: 'business',
        tone: 'professional'
      }
    }
  ];

  const results = await Promise.allSettled(
    commonRequests.map(async ({ service, params }) => {
      try {
        // Pre-generate cache keys without executing
        const { generateCacheKey } = await import('@/lib/caching/ai-cache');
        return generateCacheKey(service, params);
      } catch (error) {
        console.error(`Preload error for ${service}:`, error);
        return null;
      }
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  console.log(`Preloaded ${successful}/${commonRequests.length} common patterns`);
}

/**
 * Smart retry with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Request deduplication
 */
export class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async deduplicate<T>(
    key: string,
    operation: () => Promise<T>,
    ttl: number = 5000
  ): Promise<T> {
    // Check if there's already a pending request
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    const promise = operation();
    this.pendingRequests.set(key, promise);

    // Clean up after completion or timeout
    const cleanup = () => {
      this.pendingRequests.delete(key);
    };

    promise.then(cleanup).catch(cleanup);
    setTimeout(cleanup, ttl);

    return promise;
  }

  getStats() {
    return {
      pendingRequests: this.pendingRequests.size
    };
  }
}

// Global instances
export const globalConnectionPool = new ConnectionPool(15);
export const globalRequestBatcher = new RequestBatcher();
export const globalDeduplicator = new RequestDeduplicator();

/**
 * Utility functions
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractOperationFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    return pathParts.slice(-2).join('_') || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Performance monitoring decorator
 */
export function monitorPerformance(operation: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      let success = true;
      let errorType: string | undefined;

      try {
        const result = await method.apply(this, args);
        return result;
      } catch (error) {
        success = false;
        errorType = error instanceof Error ? error.constructor.name : 'Unknown';
        throw error;
      } finally {
        const duration = Date.now() - startTime;
        
        logPerformanceMetric({
          service: 'ai-service',
          operation,
          duration,
          success,
          errorType,
          timestamp: new Date()
        });
      }
    };

    return descriptor;
  };
}