import { Redis } from '@upstash/redis';
import { createHash } from 'crypto';

// Cache configuration
const CACHE_TTL = {
  'content-generation': 3600, // 1 hour - content can be reused
  'auto-rewrite': 1800,       // 30 minutes - rewrite results fairly stable
  'bundle-builder': 7200,     // 2 hours - bundle strategies can be reused
  'niche-discovery': 10800,   // 3 hours - market data changes slowly
  'general': 1800             // 30 minutes default
};

const CACHE_PREFIX = 'ai_cache';

// Initialize Redis client (fallback to in-memory if Redis not available)
let redis: Redis | null = null;
const memoryCache = new Map<string, { data: any; expires: number }>();

try {
  if (process.env.REDIS_URL) {
    redis = Redis.fromEnv();
  }
} catch (error) {
  console.warn('Redis not available, using in-memory cache:', error);
}

/**
 * Generate cache key from request parameters
 */
function generateCacheKey(service: string, params: any): string {
  const normalizedParams = JSON.stringify(params, Object.keys(params).sort());
  const hash = createHash('sha256').update(normalizedParams).digest('hex').substring(0, 16);
  return `${CACHE_PREFIX}:${service}:${hash}`;
}

/**
 * Get TTL for a specific service
 */
function getTTL(service: string): number {
  return CACHE_TTL[service as keyof typeof CACHE_TTL] || CACHE_TTL.general;
}

/**
 * Store result in cache
 */
export async function setCacheResult(
  service: string, 
  params: any, 
  result: any
): Promise<void> {
  const key = generateCacheKey(service, params);
  const ttl = getTTL(service);
  
  try {
    if (redis) {
      // Use Redis for distributed caching
      await redis.setex(key, ttl, JSON.stringify({
        data: result,
        timestamp: Date.now(),
        service,
        ttl
      }));
    } else {
      // Use in-memory cache as fallback
      memoryCache.set(key, {
        data: result,
        expires: Date.now() + (ttl * 1000)
      });
    }
  } catch (error) {
    console.error('Cache write error:', error);
    // Don't throw - caching should be non-blocking
  }
}

/**
 * Get result from cache
 */
export async function getCacheResult(
  service: string, 
  params: any
): Promise<any | null> {
  const key = generateCacheKey(service, params);
  
  try {
    if (redis) {
      // Get from Redis
      const cached = await redis.get(key);
      if (cached) {
        const parsed = JSON.parse(cached as string);
        return parsed.data;
      }
    } else {
      // Get from memory cache
      const cached = memoryCache.get(key);
      if (cached && cached.expires > Date.now()) {
        return cached.data;
      } else if (cached) {
        // Remove expired entry
        memoryCache.delete(key);
      }
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  
  return null;
}

/**
 * Clear cache for a specific service or all caches
 */
export async function clearCache(service?: string): Promise<void> {
  try {
    if (redis) {
      if (service) {
        // Clear specific service cache
        const pattern = `${CACHE_PREFIX}:${service}:*`;
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } else {
        // Clear all AI caches
        const pattern = `${CACHE_PREFIX}:*`;
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
      }
    } else {
      // Clear memory cache
      if (service) {
        for (const key of memoryCache.keys()) {
          if (key.includes(`:${service}:`)) {
            memoryCache.delete(key);
          }
        }
      } else {
        memoryCache.clear();
      }
    }
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  type: 'redis' | 'memory';
  totalKeys: number;
  keysByService: Record<string, number>;
  memoryUsage?: number;
}> {
  try {
    if (redis) {
      const keys = await redis.keys(`${CACHE_PREFIX}:*`);
      const keysByService: Record<string, number> = {};
      
      for (const key of keys) {
        const parts = key.split(':');
        if (parts.length >= 3) {
          const service = parts[2];
          keysByService[service] = (keysByService[service] || 0) + 1;
        }
      }
      
      return {
        type: 'redis',
        totalKeys: keys.length,
        keysByService
      };
    } else {
      const keysByService: Record<string, number> = {};
      let totalSize = 0;
      
      for (const [key, value] of memoryCache.entries()) {
        // Calculate approximate memory usage
        totalSize += JSON.stringify(value).length * 2; // Rough estimate
        
        const parts = key.split(':');
        if (parts.length >= 3) {
          const service = parts[2];
          keysByService[service] = (keysByService[service] || 0) + 1;
        }
      }
      
      return {
        type: 'memory',
        totalKeys: memoryCache.size,
        keysByService,
        memoryUsage: totalSize
      };
    }
  } catch (error) {
    console.error('Cache stats error:', error);
    return {
      type: redis ? 'redis' : 'memory',
      totalKeys: 0,
      keysByService: {}
    };
  }
}

/**
 * Cache wrapper for AI service calls
 */
export async function withCache<T>(
  service: string,
  params: any,
  computeFn: () => Promise<T>,
  options?: {
    skipCache?: boolean;
    customTTL?: number;
  }
): Promise<T> {
  // Skip cache if requested
  if (options?.skipCache) {
    return await computeFn();
  }
  
  // Try to get from cache first
  const cached = await getCacheResult(service, params);
  if (cached) {
    console.log(`Cache hit for ${service}`);
    return cached;
  }
  
  // Compute result
  console.log(`Cache miss for ${service}, computing...`);
  const result = await computeFn();
  
  // Store in cache (non-blocking)
  setCacheResult(service, params, result).catch(err => 
    console.error('Background cache storage failed:', err)
  );
  
  return result;
}

/**
 * Warm up cache with common requests
 */
export async function warmupCache(): Promise<void> {
  console.log('Starting cache warmup...');
  
  // Common content generation requests
  const commonContentRequests = [
    { contentType: 'SOCIAL', niche: 'business', platform: 'linkedin', tone: 'professional' },
    { contentType: 'SOCIAL', niche: 'marketing', platform: 'twitter', tone: 'casual' },
    { contentType: 'EMAIL', niche: 'productivity', platform: 'general', tone: 'friendly' }
  ];
  
  // Common rewrite styles
  const commonRewriteRequests = [
    { targetStyle: 'improve', targetAudience: 'business' },
    { targetStyle: 'simplify', targetAudience: 'general' },
    { targetStyle: 'expand', targetAudience: 'academic' }
  ];
  
  // Pre-generate cache keys for common patterns
  for (const request of commonContentRequests) {
    generateCacheKey('content-generation', request);
  }
  
  for (const request of commonRewriteRequests) {
    generateCacheKey('auto-rewrite', request);
  }
  
  console.log('Cache warmup completed');
}

/**
 * Cache middleware for API routes
 */
export function cacheMiddleware(service: string) {
  return async (request: any, computeFn: () => Promise<any>) => {
    const params = {
      ...request.body,
      url: request.url,
      headers: {
        'user-agent': request.headers.get('user-agent'),
        'accept-language': request.headers.get('accept-language')
      }
    };
    
    // Remove sensitive data from cache key
    delete params.headers;
    delete params.credentials;
    
    return withCache(service, params, computeFn);
  };
}