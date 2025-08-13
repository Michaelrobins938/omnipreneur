// @ts-nocheck
// API Client with caching and error handling
interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  message?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class APIClient {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(url: string, options?: RequestInit): string {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${body}`;
  }

  private isValidCache<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  private setCache<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  private getCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && this.isValidCache(entry)) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key); // Remove expired entry
    }
    return null;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public clearCachePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  async request<T>(
    endpoint: string, 
    options: RequestInit & { 
      cache?: boolean; 
      cacheTTL?: number;
      timeout?: number;
    } = {}
  ): Promise<APIResponse<T>> {
    const { cache = false, cacheTTL, timeout = 30000, ...fetchOptions } = options;
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers
    };

    // Set credentials to include by default
    const requestOptions: RequestInit = {
      credentials: 'include',
      ...fetchOptions,
      headers
    };

    // Check cache if enabled
    const cacheKey = this.getCacheKey(endpoint, requestOptions);
    if (cache && requestOptions.method === 'GET') {
      const cachedData = this.getCache<APIResponse<T>>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(endpoint, {
        ...requestOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in.');
      }

      if (response.status === 403) {
        throw new Error('Access denied. Insufficient permissions.');
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      let result: APIResponse<T>;

      if (!response.ok) {
        // Try to parse error response
        try {
          const errorData = await response.json();
          result = {
            success: false,
            error: {
              message: errorData.error?.message || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
              code: errorData.error?.code || response.status.toString()
            }
          };
        } catch {
          result = {
            success: false,
            error: {
              message: `HTTP ${response.status}: ${response.statusText}`,
              code: response.status.toString()
            }
          };
        }
      } else {
        // Parse successful response
        try {
          result = await response.json();
        } catch {
          // Handle non-JSON responses
          result = {
            success: true,
            data: null as T
          };
        }
      }

      // Cache successful GET requests
      if (cache && requestOptions.method === 'GET' && result.success) {
        this.setCache(cacheKey, result, cacheTTL);
      }

      return result;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: {
              message: 'Request timeout. Please try again.',
              code: 'TIMEOUT'
            }
          };
        }

        // Check for network connectivity
        if (!navigator.onLine) {
          return {
            success: false,
            error: {
              message: 'You appear to be offline. Please check your internet connection.',
              code: 'OFFLINE'
            }
          };
        }

        return {
          success: false,
          error: {
            message: error.message,
            code: 'NETWORK_ERROR'
          }
        };
      }

      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR'
        }
      };
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: { cache?: boolean; cacheTTL?: number; timeout?: number }): Promise<APIResponse<T>> {
    const { cache, cacheTTL, timeout, ...requestOptions } = options || {};
    return this.request<T>(endpoint, { method: 'GET', ...(cache !== undefined ? { cache } : {}), ...(cacheTTL !== undefined ? { cacheTTL } : {}), ...(timeout !== undefined ? { timeout } : {}) });
  }

  async post<T>(endpoint: string, data?: any, options?: { timeout?: number }): Promise<APIResponse<T>> {
    const requestOptions: any = {
      method: 'POST',
      ...options
    };
    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data);
    }
    return this.request<T>(endpoint, requestOptions);
  }

  async put<T>(endpoint: string, data?: any, options?: { timeout?: number }): Promise<APIResponse<T>> {
    const requestOptions: any = {
      method: 'PUT',
      ...options
    };
    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data);
    }
    return this.request<T>(endpoint, requestOptions);
  }

  async delete<T>(endpoint: string, options?: { timeout?: number }): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  async patch<T>(endpoint: string, data?: any, options?: { timeout?: number }): Promise<APIResponse<T>> {
    const requestOptions: any = {
      method: 'PATCH',
      ...options
    };
    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data);
    }
    return this.request<T>(endpoint, requestOptions);
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export types
export type { APIResponse };

// Helper function for batch requests
export async function batchRequests<T>(
  requests: Array<() => Promise<APIResponse<T>>>,
  options: { 
    concurrent?: number; 
    failFast?: boolean;
  } = {}
): Promise<Array<APIResponse<T>>> {
  const { concurrent = 5, failFast = false } = options;
  const results: Array<APIResponse<T>> = [];
  
  for (let i = 0; i < requests.length; i += concurrent) {
    const batch = requests.slice(i, i + concurrent);
    
    if (failFast) {
      const batchResults = await Promise.all(batch.map(req => req()));
      results.push(...batchResults);
      
      // Check if any request failed
      if (batchResults.some(result => !result.success)) {
        break;
      }
    } else {
      const batchResults = await Promise.allSettled(batch.map(req => req()));
      results.push(...batchResults.map(result => 
        result.status === 'fulfilled' 
          ? result.value 
          : { 
              success: false, 
              error: { 
                message: result.reason?.message || 'Request failed',
                code: 'BATCH_ERROR'
              } 
            } as APIResponse<T>
      ));
    }
  }
  
  return results;
}

// Performance monitoring
export function createPerformanceMonitor() {
  const metrics = new Map<string, Array<number>>();

  return {
    startTimer: (key: string) => {
      const start = performance.now();
      return () => {
        const duration = performance.now() - start;
        if (!metrics.has(key)) {
          metrics.set(key, []);
        }
        metrics.get(key)!.push(duration);
      };
    },
    
    getMetrics: (key: string) => {
      const times = metrics.get(key) || [];
      if (times.length === 0) return null;
      
      const sorted = [...times].sort((a, b) => a - b);
      return {
        count: times.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        avg: times.reduce((sum, time) => sum + time, 0) / times.length,
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
      };
    },
    
    getAllMetrics() {
      const allMetrics: Record<string, any> = {};
      for (const [key] of metrics) {
        allMetrics[key] = this.getMetrics(key);
      }
      return allMetrics;
    },
    
    clear: () => metrics.clear()
  };
}

// Global performance monitor
export const performanceMonitor = createPerformanceMonitor();