// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { cache, cacheKeys } from '@/lib/cache/redis-cache';

export interface RateLimitConfig {
  windowMs: number;      // Time window in milliseconds
  max: number;           // Max requests per window
  keyGenerator: (req: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  onLimitReached?: (req: NextRequest) => void;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  totalHits: number;
}

/**
 * Enhanced rate limiter with Redis support and advanced features
 */
export class EnhancedRateLimit {
  private config: Required<RateLimitConfig>;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs,
      max: config.max,
      keyGenerator: config.keyGenerator,
      skipSuccessfulRequests: config.skipSuccessfulRequests ?? false,
      skipFailedRequests: config.skipFailedRequests ?? false,
      onLimitReached: config.onLimitReached ?? (() => {}),
      message: config.message ?? 'Too many requests',
      standardHeaders: config.standardHeaders ?? true,
      legacyHeaders: config.legacyHeaders ?? true
    };
  }

  /**
   * Check if request is within rate limit
   */
  async checkLimit(request: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(request);
    const cacheKey = cacheKeys.rateLimit(key);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    try {
      // Use Redis for distributed rate limiting if available
      const currentCount = await this.incrementCounter(cacheKey, windowStart);
      
      const remaining = Math.max(0, this.config.max - currentCount);
      const resetTime = Math.ceil((now + this.config.windowMs) / 1000);

      return {
        allowed: currentCount <= this.config.max,
        limit: this.config.max,
        remaining,
        resetTime,
        totalHits: currentCount
      };

    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open - allow request if rate limiter fails
      return {
        allowed: true,
        limit: this.config.max,
        remaining: this.config.max,
        resetTime: Math.ceil((now + this.config.windowMs) / 1000),
        totalHits: 0
      };
    }
  }

  /**
   * Increment counter with sliding window
   */
  private async incrementCounter(cacheKey: string, windowStart: number): Promise<number> {
    const now = Date.now();
    
    // Try to use Redis Lua script for atomic operation
    try {
      // This would be a Redis Lua script in production
      // For now, use simple increment with expiration
      const current = await cache.incr(cacheKey, { 
        ttl: Math.ceil(this.config.windowMs / 1000) 
      });
      
      return current;
    } catch (error) {
      // Fallback to basic increment
      console.warn('Redis rate limiting failed, using fallback:', error);
      return await cache.incr(cacheKey, { 
        ttl: Math.ceil(this.config.windowMs / 1000) 
      });
    }
  }

  /**
   * Get rate limit headers
   */
  getRateLimitHeaders(result: RateLimitResult): HeadersInit {
    const headers: HeadersInit = {};

    if (this.config.standardHeaders) {
      headers['RateLimit-Limit'] = String(result.limit);
      headers['RateLimit-Remaining'] = String(result.remaining);
      headers['RateLimit-Reset'] = String(result.resetTime);
    }

    if (this.config.legacyHeaders) {
      headers['X-RateLimit-Limit'] = String(result.limit);
      headers['X-RateLimit-Remaining'] = String(result.remaining);
      headers['X-RateLimit-Reset'] = String(result.resetTime);
    }

    return headers;
  }

  /**
   * Create middleware function
   */
  middleware() {
    return async (request: NextRequest, handler: Function) => {
      const result = await this.checkLimit(request);
      
      // Add rate limit headers
      const response = await handler(request);
      const headers = this.getRateLimitHeaders(result);
      
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      if (!result.allowed) {
        this.config.onLimitReached(request);
        
        return NextResponse.json({
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: this.config.message,
            retryAfter: result.resetTime - Math.floor(Date.now() / 1000)
          }
        }, { 
          status: 429,
          headers
        });
      }

      return response;
    };
  }
}

/**
 * Preset rate limit configurations
 */
export const rateLimitPresets = {
  // Very strict - for sensitive operations
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5
  },
  
  // Authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20
  },
  
  // API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100
  },
  
  // AI generation endpoints
  ai: {
    windowMs: 60 * 1000, // 1 minute
    max: 30
  },
  
  // File upload endpoints
  upload: {
    windowMs: 60 * 1000, // 1 minute
    max: 10
  },
  
  // Search endpoints
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 200
  },
  
  // Analytics endpoints
  analytics: {
    windowMs: 60 * 1000, // 1 minute
    max: 50
  }
};

/**
 * Advanced rate limiting with different strategies
 */
export class AdaptiveRateLimit extends EnhancedRateLimit {
  private userTiers: Map<string, string> = new Map();

  /**
   * Get rate limit based on user tier
   */
  async checkAdaptiveLimit(request: NextRequest, userId?: string): Promise<RateLimitResult> {
    if (!userId) {
      return super.checkLimit(request);
    }

    // Get user tier (could be cached)
    const userTier = await this.getUserTier(userId);
    const adjustedConfig = this.getConfigForTier(userTier);
    
    // Temporarily override config
    const originalMax = this.config.max;
    this.config.max = adjustedConfig.max;
    
    const result = await super.checkLimit(request);
    
    // Restore original config
    this.config.max = originalMax;
    
    return result;
  }

  /**
   * Get user tier from cache or database
   */
  private async getUserTier(userId: string): Promise<string> {
    const cached = this.userTiers.get(userId);
    if (cached) return cached;

    // In production, this would query the database
    // For now, return default tier
    const tier = 'free'; // 'free', 'pro', 'enterprise'
    this.userTiers.set(userId, tier);
    
    return tier;
  }

  /**
   * Get rate limit config based on user tier
   */
  private getConfigForTier(tier: string): { max: number; windowMs: number } {
    const tierConfigs = {
      free: { max: this.config.max, windowMs: this.config.windowMs },
      pro: { max: this.config.max * 3, windowMs: this.config.windowMs },
      enterprise: { max: this.config.max * 10, windowMs: this.config.windowMs }
    };

    return tierConfigs[tier as keyof typeof tierConfigs] || tierConfigs.free;
  }
}

/**
 * IP-based rate limiter
 */
export function createIPRateLimit(config: Omit<RateLimitConfig, 'keyGenerator'>) {
  return new EnhancedRateLimit({
    ...config,
    keyGenerator: (req) => getClientIP(req)
  });
}

/**
 * User-based rate limiter
 */
export function createUserRateLimit(config: Omit<RateLimitConfig, 'keyGenerator'>) {
  return new EnhancedRateLimit({
    ...config,
    keyGenerator: (req) => {
      const user = (req as any).user;
      return user?.userId || getClientIP(req);
    }
  });
}

/**
 * Endpoint-specific rate limiter
 */
export function createEndpointRateLimit(
  endpoint: string, 
  config: Omit<RateLimitConfig, 'keyGenerator'>
) {
  return new EnhancedRateLimit({
    ...config,
    keyGenerator: (req) => {
      const user = (req as any).user;
      const identifier = user?.userId || getClientIP(req);
      return `${endpoint}:${identifier}`;
    }
  });
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || remoteAddr || 'unknown';
}

/**
 * Sliding window rate limiter (more precise)
 */
export class SlidingWindowRateLimit {
  private config: RateLimitConfig;
  private windows: Map<string, number[]> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async checkLimit(request: NextRequest): Promise<RateLimitResult> {
    const key = this.config.keyGenerator(request);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get or create window
    let window = this.windows.get(key) || [];
    
    // Remove expired entries
    window = window.filter(timestamp => timestamp > windowStart);
    
    // Check if limit exceeded
    const allowed = window.length < this.config.max;
    
    if (allowed) {
      window.push(now);
    }
    
    // Update window
    this.windows.set(key, window);
    
    return {
      allowed,
      limit: this.config.max,
      remaining: Math.max(0, this.config.max - window.length),
      resetTime: Math.ceil((now + this.config.windowMs) / 1000),
      totalHits: window.length
    };
  }
}

// Utility function for backwards compatibility with existing rate limit middleware
export function withRateLimit(
  handler: Function,
  config?: Partial<RateLimitConfig>
) {
  const rateLimit = new EnhancedRateLimit({
    windowMs: 60 * 1000,
    max: 100,
    keyGenerator: (req) => getClientIP(req),
    ...config
  });

  return async (request: NextRequest) => {
    const result = await rateLimit.checkLimit(request);
    
    if (!result.allowed) {
      const headers = rateLimit.getRateLimitHeaders(result);
      
      return NextResponse.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
          retryAfter: result.resetTime - Math.floor(Date.now() / 1000)
        }
      }, { 
        status: 429,
        headers
      });
    }
    
    const response = await handler(request);
    
    // Add rate limit headers to successful responses
    const headers = rateLimit.getRateLimitHeaders(result);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}