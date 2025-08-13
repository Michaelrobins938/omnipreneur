import { NextRequest, NextResponse } from 'next/server';
import { EnhancedRateLimit, RateLimitConfig } from '@/lib/rate-limit/enhanced-rate-limit';

// Backwards-compatible withRateLimit that supports optional custom key generator
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: Partial<RateLimitConfig>,
  keyGenerator?: (req: NextRequest) => string
) {
  const limiter = new EnhancedRateLimit({
    windowMs: 60 * 1000,
    max: 100,
    keyGenerator: keyGenerator || ((req) => {
      const forwarded = req.headers.get('x-forwarded-for');
      const realIP = req.headers.get('x-real-ip');
      const remoteAddr = req.headers.get('remote-addr');
      return (forwarded?.split(',')[0]?.trim() || realIP || remoteAddr || 'unknown');
    }),
    ...config,
  });

  return async (request: NextRequest) => {
    const result = await limiter.checkLimit(request);
    if (!result.allowed) {
      const headers = limiter.getRateLimitHeaders(result);
      return NextResponse.json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later',
          retryAfter: result.resetTime - Math.floor(Date.now() / 1000)
        }
      }, { status: 429, headers });
    }

    const response = await handler(request);
    const headers = limiter.getRateLimitHeaders(result);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  };
}

export type { RateLimitConfig } from '@/lib/rate-limit/enhanced-rate-limit';



