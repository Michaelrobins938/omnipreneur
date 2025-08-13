// Lightweight in-memory rate limiter for API routes
// Note: For production, replace with a distributed store (e.g., Redis)

import { NextRequest, NextResponse } from 'next/server';

type Bucket = {
  remaining: number;
  resetAt: number; // epoch ms when window resets
};

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { remaining: limit - 1, resetAt });
    return { allowed: true, limit, remaining: limit - 1, resetAt };
  }

  if (bucket.remaining > 0) {
    bucket.remaining -= 1;
    return { allowed: true, limit, remaining: bucket.remaining, resetAt: bucket.resetAt };
  }

  return { allowed: false, limit, remaining: 0, resetAt: bucket.resetAt };
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.floor(result.resetAt / 1000))
  };
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff && xff.length > 0) {
    // Use the first IP in the list
    return xff.split(',')[0]?.trim() || 'ip-unknown';
  }
  const xri = request.headers.get('x-real-ip');
  if (xri) return xri;
  // As a last resort, try the request's ip if available (may be undefined in some runtimes)
  return (request as any).ip || 'ip-unknown';
}

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: { limit: number; windowMs: number; key?: (request: NextRequest) => string }
) {
  return async (request: NextRequest) => {
    const defaultOptions = { limit: 60, windowMs: 5 * 60 * 1000 };
    const opts = { ...defaultOptions, ...(options || {}) } as Required<Omit<typeof defaultOptions, never>> & { key?: (request: NextRequest) => string };

    const derivedKey = opts.key ? opts.key(request) : `rl:${getClientIp(request)}`;
    const result = await checkRateLimit(derivedKey, opts.limit, opts.windowMs);

    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' }
        }),
        { status: 429, headers: { 'Content-Type': 'application/json', ...rateLimitHeaders(result) } }
      );
    }

    const response = await handler(request);
    const headers = rateLimitHeaders(result);
    Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  };
}

import { NextApiRequest } from 'next';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextApiRequest) => string;
}



// In-memory store for rate limiting (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  req: NextApiRequest,
  config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    keyGenerator: (req) => req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown'
  }
): Promise<RateLimitResult> {
  const key = config.keyGenerator!(req);
  const now = Date.now();
  
  // Get current rate limit data
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    
    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs
    };
  }
  
  if (current.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: current.resetTime
    };
  }
  
  // Increment count
  current.count++;
  rateLimitStore.set(key, current);
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - current.count,
    resetAt: current.resetTime
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of Array.from(rateLimitStore.entries())) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

// Different rate limit configurations for different endpoints
export const rateLimitConfigs = {
  rewrite: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 50
  },
  content: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20
  },
  bundle: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10
  },
  affiliate: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 30
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  }
};

// Helper function to get rate limit config by endpoint
export function getRateLimitConfig(endpoint: string): RateLimitConfig {
  return rateLimitConfigs[endpoint as keyof typeof rateLimitConfigs] || {
    windowMs: 15 * 60 * 1000,
    maxRequests: 100
  };
} 