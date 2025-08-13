// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { advancedRateLimiter } from '@/lib/rate-limit/advanced-limiter';

// Rate limiting middleware for Next.js
export async function rateLimitMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    // Extract request information
    const ip = getClientIP(request);
    const endpoint = request.nextUrl.pathname;
    const method = request.method;
    const userAgent = request.headers.get('user-agent') || '';
    const userId = await getUserIdFromRequest(request);
    
    // Prepare rate limit request
    const rateLimitRequest = {
      ip,
      userId,
      endpoint,
      method,
      userAgent,
      headers: Object.fromEntries(request.headers.entries())
    };
    
    // Check rate limits
    const result = await advancedRateLimiter.checkLimit(rateLimitRequest);
    
    if (!result.allowed) {
      // Create rate limit response
      const response = NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: getRateLimitMessage(result.reason),
            details: {
              limit: result.limit,
              remaining: result.remaining || 0,
              resetTime: result.resetTime,
              retryAfter: result.retryAfter
            }
          }
        },
        { status: 429 }
      );
      
      // Add rate limit headers
      addRateLimitHeaders(response, result);
      
      return response;
    }
    
    // Request allowed - add rate limit headers to track usage
    const response = NextResponse.next();
    addRateLimitHeaders(response, result);
    
    return null; // Allow request to continue
    
  } catch (error) {
    console.error('Rate limiting middleware error:', error);
    
    // Don't block requests if rate limiting fails
    return null;
  }
}

// Comprehensive rate limiting middleware with fallback strategies
export function withRateLimit(options: RateLimitOptions = {}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    // Skip rate limiting for certain paths
    if (shouldSkipRateLimit(request.nextUrl.pathname)) {
      return null;
    }
    
    // Apply custom rate limiting configuration
    if (options.customRules) {
      for (const rule of options.customRules) {
        advancedRateLimiter.addRule(rule);
      }
    }
    
    // Adjust limits based on system load if enabled
    if (options.adaptiveLoad) {
      await advancedRateLimiter.adjustLimitsBasedOnLoad();
    }
    
    // Execute rate limiting
    return rateLimitMiddleware(request);
  };
}

// Express.js style rate limiting middleware
export function createRateLimitMiddleware(options: ExpressRateLimitOptions = {}) {
  return async (req: any, res: any, next: any) => {
    try {
      const rateLimitRequest = {
        ip: getExpressClientIP(req),
        userId: req.user?.id,
        endpoint: req.path,
        method: req.method,
        userAgent: req.get('User-Agent') || '',
        headers: req.headers
      };
      
      const result = await advancedRateLimiter.checkLimit(rateLimitRequest);
      
      if (!result.allowed) {
        // Set rate limit headers
        res.set('X-RateLimit-Limit', result.limit?.toString() || '0');
        res.set('X-RateLimit-Remaining', (result.remaining || 0).toString());
        res.set('X-RateLimit-Reset', result.resetTime?.toString() || '0');
        res.set('Retry-After', result.retryAfter?.toString() || '60');
        
        // Call custom handler or send default response
        if (options.onLimitReached) {
          return options.onLimitReached(req, res, next, result);
        }
        
        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: getRateLimitMessage(result.reason),
            retryAfter: result.retryAfter
          }
        });
      }
      
      // Add rate limit headers for successful requests
      res.set('X-RateLimit-Limit', result.limit?.toString() || '1000');
      res.set('X-RateLimit-Remaining', (result.remaining || 0).toString());
      res.set('X-RateLimit-Reset', result.resetTime?.toString() || '0');
      
      next();
      
    } catch (error) {
      console.error('Express rate limiting error:', error);
      
      if (options.skipFailures !== false) {
        next(); // Continue on error by default
      } else {
        next(error);
      }
    }
  };
}

// Specialized rate limiters for different use cases
export const authRateLimit = withRateLimit({
  customRules: [
    {
      name: 'auth_login',
      endpoint: '/api/auth/login',
      limit: 5,
      window: 900000, // 15 minutes
      algorithm: 'fixed_window',
      priority: 10,
      burstProtection: {
        limit: 3,
        window: 60000
      }
    }
  ]
});

export const uploadRateLimit = withRateLimit({
  customRules: [
    {
      name: 'file_upload',
      endpoint: '/api/upload',
      limit: 20,
      window: 3600000, // 1 hour
      algorithm: 'token_bucket',
      priority: 8
    }
  ],
  adaptiveLoad: true
});

export const apiRateLimit = withRateLimit({
  customRules: [
    {
      name: 'api_general',
      endpoint: '/api/*',
      limit: 1000,
      window: 3600000, // 1 hour
      algorithm: 'sliding_window',
      priority: 1
    }
  ],
  adaptiveLoad: true
});

export const webhookRateLimit = withRateLimit({
  customRules: [
    {
      name: 'webhook_calls',
      endpoint: '/api/webhooks/*',
      limit: 100,
      window: 60000, // 1 minute
      algorithm: 'fixed_window',
      priority: 9
    }
  ]
});

// Real-time rate limit monitoring
export class RateLimitMonitor {
  private static instance: RateLimitMonitor;
  private subscribers: Set<(stats: any) => void> = new Set();
  private statsInterval: NodeJS.Timer | null = null;

  static getInstance(): RateLimitMonitor {
    if (!RateLimitMonitor.instance) {
      RateLimitMonitor.instance = new RateLimitMonitor();
    }
    return RateLimitMonitor.instance;
  }

  subscribe(callback: (stats: any) => void): () => void {
    this.subscribers.add(callback);
    
    if (this.subscribers.size === 1) {
      this.startMonitoring();
    }
    
    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0) {
        this.stopMonitoring();
      }
    };
  }

  private startMonitoring(): void {
    this.statsInterval = setInterval(async () => {
      try {
        const stats = await advancedRateLimiter.getStatistics('5m');
        this.notifySubscribers(stats);
      } catch (error) {
        console.error('Rate limit monitoring error:', error);
      }
    }, 5000); // Update every 5 seconds
  }

  private stopMonitoring(): void {
    if (this.statsInterval) {
      clearInterval(this.statsInterval);
      this.statsInterval = null;
    }
  }

  private notifySubscribers(stats: any): void {
    this.subscribers.forEach(callback => {
      try {
        callback(stats);
      } catch (error) {
        console.error('Rate limit monitor callback error:', error);
      }
    });
  }

  async getCurrentStats(): Promise<any> {
    return advancedRateLimiter.getStatistics('1h');
  }
}

// Rate limit configuration for different environments
export const rateLimitConfigs = {
  development: {
    enabled: false,
    skipFailures: true,
    logLevel: 'debug'
  },
  
  staging: {
    enabled: true,
    skipFailures: true,
    logLevel: 'info',
    limits: {
      api: { limit: 5000, window: 3600000 },
      auth: { limit: 10, window: 900000 }
    }
  },
  
  production: {
    enabled: true,
    skipFailures: false,
    logLevel: 'warn',
    limits: {
      api: { limit: 1000, window: 3600000 },
      auth: { limit: 5, window: 900000 },
      upload: { limit: 50, window: 3600000 }
    },
    distributed: true,
    monitoring: true
  }
};

// Helper functions
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || cfIP || 'unknown';
}

function getExpressClientIP(req: any): string {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         'unknown';
}

async function getUserIdFromRequest(request: NextRequest): Promise<string | undefined> {
  try {
    // Extract user ID from JWT token or session
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return undefined;
    
    // Mock implementation - replace with actual token verification
    const token = authHeader.replace('Bearer ', '');
    if (token === 'mock_token') {
      return 'user_123';
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

function shouldSkipRateLimit(pathname: string): boolean {
  const skipPaths = [
    '/health',
    '/api/health',
    '/metrics',
    '/favicon.ico',
    '/_next/',
    '/static/'
  ];
  
  return skipPaths.some(path => pathname.startsWith(path));
}

function addRateLimitHeaders(response: NextResponse, result: any): void {
  if (result.limit !== undefined) {
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
  }
  
  if (result.remaining !== undefined) {
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  }
  
  if (result.resetTime) {
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());
  }
  
  if (result.retryAfter) {
    response.headers.set('Retry-After', result.retryAfter.toString());
  }
}

function getRateLimitMessage(reason?: string): string {
  const messages: Record<string, string> = {
    'RATE_LIMIT_EXCEEDED': 'Rate limit exceeded. Please try again later.',
    'BURST_LIMIT_EXCEEDED': 'Too many requests in a short time. Please slow down.',
    'GLOBAL_IP_LIMIT_EXCEEDED': 'Global rate limit exceeded for your IP address.',
    'IP_BLACKLISTED': 'Your IP address has been temporarily blocked.',
    'GEOGRAPHIC_RESTRICTION': 'Requests from your location are currently restricted.'
  };
  
  return messages[reason || 'RATE_LIMIT_EXCEEDED'] || 'Rate limit exceeded.';
}

// Type definitions
interface RateLimitOptions {
  customRules?: Array<any>;
  adaptiveLoad?: boolean;
  skipPaths?: string[];
  onLimitReached?: (request: NextRequest, result: any) => NextResponse;
}

interface ExpressRateLimitOptions {
  onLimitReached?: (req: any, res: any, next: any, result: any) => void;
  skipFailures?: boolean;
  skipPaths?: string[];
}

// Export monitor instance
export const rateLimitMonitor = RateLimitMonitor.getInstance();