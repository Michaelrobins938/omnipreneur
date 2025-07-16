import { NextApiRequest } from 'next';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: NextApiRequest) => string;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
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
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs
    };
  }
  
  if (current.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetTime: current.resetTime
    };
  }
  
  // Increment count
  current.count++;
  rateLimitStore.set(key, current);
  
  return {
    success: true,
    remaining: config.maxRequests - current.count,
    resetTime: current.resetTime
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