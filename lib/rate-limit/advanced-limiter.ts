// @ts-nocheck
import { EventEmitter } from 'events';

// Advanced rate limiting system with multiple strategies
export class AdvancedRateLimiter extends EventEmitter {
  private stores: Map<string, RateLimitStore> = new Map();
  private rules: Map<string, RateLimitRule[]> = new Map();
  private globalLimits: Map<string, GlobalLimit> = new Map();
  private whitelistedIPs: Set<string> = new Set();
  private blacklistedIPs: Set<string> = new Set();
  private suspiciousActivity: Map<string, SuspiciousActivity> = new Map();

  constructor() {
    super();
    this.initializeDefaultRules();
    this.startCleanupTimer();
  }

  // Main rate limiting function
  async checkLimit(request: RateLimitRequest): Promise<RateLimitResult> {
    const identifier = this.getIdentifier(request);
    
    // Check blacklist first
    if (this.blacklistedIPs.has(request.ip)) {
      return {
        allowed: false,
        reason: 'IP_BLACKLISTED',
        resetTime: Date.now() + 3600000, // 1 hour
        retryAfter: 3600
      };
    }
    
    // Check whitelist - bypass rate limits
    if (this.whitelistedIPs.has(request.ip)) {
      return {
        allowed: true,
        reason: 'WHITELISTED',
        remaining: Infinity,
        resetTime: Date.now() + 3600000
      };
    }
    
    // Get applicable rules
    const rules = this.getRulesForRequest(request);
    
    // Check each rule
    for (const rule of rules) {
      const result = await this.checkRule(rule, identifier, request);
      
      if (!result.allowed) {
        // Track failed attempts for suspicious activity detection
        this.trackSuspiciousActivity(request.ip, rule);
        
        // Emit rate limit event
        this.emit('rateLimit:exceeded', {
          rule: rule.name,
          identifier,
          request,
          result
        });
        
        return result;
      }
    }
    
    // Check global limits
    const globalResult = await this.checkGlobalLimits(request);
    if (!globalResult.allowed) {
      return globalResult;
    }
    
    // All checks passed - record the request
    await this.recordRequest(identifier, request);
    
    // Get remaining count for the most restrictive rule
    const remaining = await this.getRemainingCount(rules, identifier);
    
    return {
      allowed: true,
      remaining,
      resetTime: Date.now() + Math.min(...rules.map(r => r.window))
    };
  }

  // Add custom rate limit rule
  addRule(rule: RateLimitRule): void {
    const endpoint = rule.endpoint || '*';
    
    if (!this.rules.has(endpoint)) {
      this.rules.set(endpoint, []);
    }
    
    this.rules.get(endpoint)!.push(rule);
    
    // Sort rules by priority (higher first)
    this.rules.get(endpoint)!.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  // Dynamic rate limiting based on system load
  async adjustLimitsBasedOnLoad(): Promise<void> {
    const systemLoad = await this.getSystemLoad();
    const dbLoad = await this.getDatabaseLoad();
    
    // Reduce limits if system is under high load
    if (systemLoad > 80 || dbLoad > 80) {
      this.applyLoadBasedLimits(0.5); // Reduce by 50%
      this.emit('rateLimit:loadAdjustment', { systemLoad, dbLoad, factor: 0.5 });
    } else if (systemLoad > 60 || dbLoad > 60) {
      this.applyLoadBasedLimits(0.75); // Reduce by 25%
      this.emit('rateLimit:loadAdjustment', { systemLoad, dbLoad, factor: 0.75 });
    } else {
      this.applyLoadBasedLimits(1.0); // Normal limits
    }
  }

  // Sliding window rate limiting
  async slidingWindowCheck(rule: RateLimitRule, identifier: string): Promise<RateLimitResult> {
    const store = this.getStore(rule.name);
    const now = Date.now();
    const windowStart = now - rule.window;
    
    // Get requests in the current window
    const requests = store.getRequestsInWindow(identifier, windowStart, now);
    
    if (requests.length >= rule.limit) {
      const oldestRequest = Math.min(...requests);
      const resetTime = oldestRequest + rule.window;
      
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
        limit: rule.limit,
        remaining: 0
      };
    }
    
    return {
      allowed: true,
      remaining: rule.limit - requests.length - 1,
      resetTime: now + rule.window
    };
  }

  // Token bucket rate limiting
  async tokenBucketCheck(rule: RateLimitRule, identifier: string): Promise<RateLimitResult> {
    const store = this.getStore(rule.name);
    const bucket = store.getTokenBucket(identifier) || {
      tokens: rule.limit,
      lastRefill: Date.now()
    };
    
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed / (rule.window / rule.limit));
    
    // Refill tokens
    bucket.tokens = Math.min(rule.limit, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
    
    if (bucket.tokens < 1) {
      const refillTime = bucket.lastRefill + (rule.window / rule.limit);
      
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        resetTime: refillTime,
        retryAfter: Math.ceil((refillTime - now) / 1000),
        remaining: 0
      };
    }
    
    // Consume token
    bucket.tokens -= 1;
    store.setTokenBucket(identifier, bucket);
    
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetTime: now + rule.window
    };
  }

  // Fixed window rate limiting
  async fixedWindowCheck(rule: RateLimitRule, identifier: string): Promise<RateLimitResult> {
    const store = this.getStore(rule.name);
    const now = Date.now();
    const windowStart = Math.floor(now / rule.window) * rule.window;
    const windowKey = `${identifier}:${windowStart}`;
    
    const count = store.getWindowCount(windowKey) || 0;
    
    if (count >= rule.limit) {
      const resetTime = windowStart + rule.window;
      
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        resetTime,
        retryAfter: Math.ceil((resetTime - now) / 1000),
        remaining: 0
      };
    }
    
    // Increment counter
    store.incrementWindowCount(windowKey, rule.window);
    
    return {
      allowed: true,
      remaining: rule.limit - count - 1,
      resetTime: windowStart + rule.window
    };
  }

  // Distributed rate limiting for multi-server setups
  async distributedCheck(rule: RateLimitRule, identifier: string): Promise<RateLimitResult> {
    if (!rule.distributed) {
      throw new Error('Rule is not configured for distributed rate limiting');
    }
    
    // Use Redis or similar for distributed state
    const distributedStore = await this.getDistributedStore();
    const key = `rate_limit:${rule.name}:${identifier}`;
    
    const pipeline = distributedStore.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, Math.ceil(rule.window / 1000));
    
    const results = await pipeline.exec();
    const count = results[0][1] as number;
    
    if (count > rule.limit) {
      const ttl = await distributedStore.ttl(key);
      const resetTime = Date.now() + (ttl * 1000);
      
      return {
        allowed: false,
        reason: 'RATE_LIMIT_EXCEEDED',
        resetTime,
        retryAfter: ttl,
        remaining: 0
      };
    }
    
    return {
      allowed: true,
      remaining: rule.limit - count,
      resetTime: Date.now() + rule.window
    };
  }

  // Adaptive rate limiting based on user behavior
  async adaptiveCheck(rule: RateLimitRule, identifier: string, request: RateLimitRequest): Promise<RateLimitResult> {
    const userProfile = await this.getUserProfile(identifier);
    
    // Adjust limits based on user tier
    let adjustedLimit = rule.limit;
    
    switch (userProfile.tier) {
      case 'premium':
        adjustedLimit *= 2;
        break;
      case 'enterprise':
        adjustedLimit *= 5;
        break;
      case 'free':
        adjustedLimit *= 0.5;
        break;
    }
    
    // Adjust based on user reputation
    if (userProfile.reputation > 0.8) {
      adjustedLimit *= 1.5;
    } else if (userProfile.reputation < 0.3) {
      adjustedLimit *= 0.5;
    }
    
    // Create adjusted rule
    const adjustedRule = { ...rule, limit: Math.floor(adjustedLimit) };
    
    return this.slidingWindowCheck(adjustedRule, identifier);
  }

  // IP-based geographic rate limiting
  async geographicCheck(rule: RateLimitRule, request: RateLimitRequest): Promise<RateLimitResult> {
    if (!rule.geographic) return { allowed: true };
    
    const location = await this.getIPLocation(request.ip);
    const geoRule = rule.geographic[location.country] || rule.geographic.default;
    
    if (!geoRule) return { allowed: true };
    
    const adjustedRule = { ...rule, ...geoRule };
    return this.slidingWindowCheck(adjustedRule, request.ip);
  }

  // Burst protection
  async burstProtectionCheck(rule: RateLimitRule, identifier: string): Promise<RateLimitResult> {
    if (!rule.burstProtection) return { allowed: true };
    
    const store = this.getStore(rule.name);
    const now = Date.now();
    const burstWindow = rule.burstProtection.window || 1000; // 1 second default
    const burstLimit = rule.burstProtection.limit || 5;
    
    const recentRequests = store.getRequestsInWindow(
      identifier, 
      now - burstWindow, 
      now
    );
    
    if (recentRequests.length >= burstLimit) {
      return {
        allowed: false,
        reason: 'BURST_LIMIT_EXCEEDED',
        resetTime: now + burstWindow,
        retryAfter: Math.ceil(burstWindow / 1000)
      };
    }
    
    return { allowed: true };
  }

  // Whitelist/Blacklist management
  addToWhitelist(ip: string): void {
    this.whitelistedIPs.add(ip);
    this.emit('whitelist:added', { ip });
  }

  removeFromWhitelist(ip: string): void {
    this.whitelistedIPs.delete(ip);
    this.emit('whitelist:removed', { ip });
  }

  addToBlacklist(ip: string, duration?: number): void {
    this.blacklistedIPs.add(ip);
    this.emit('blacklist:added', { ip, duration });
    
    if (duration) {
      setTimeout(() => {
        this.removeFromBlacklist(ip);
      }, duration);
    }
  }

  removeFromBlacklist(ip: string): void {
    this.blacklistedIPs.delete(ip);
    this.emit('blacklist:removed', { ip });
  }

  // Suspicious activity detection
  private trackSuspiciousActivity(ip: string, rule: RateLimitRule): void {
    const activity = this.suspiciousActivity.get(ip) || {
      violations: 0,
      firstViolation: Date.now(),
      lastViolation: Date.now(),
      rules: new Set()
    };
    
    activity.violations++;
    activity.lastViolation = Date.now();
    activity.rules.add(rule.name);
    
    this.suspiciousActivity.set(ip, activity);
    
    // Auto-blacklist after threshold
    if (activity.violations >= 10) {
      this.addToBlacklist(ip, 3600000); // 1 hour
      this.emit('security:autoBlacklist', { ip, activity });
    }
  }

  // Get rate limit statistics
  async getStatistics(timeRange: string = '1h'): Promise<RateLimitStatistics> {
    const stats: RateLimitStatistics = {
      totalRequests: 0,
      blockedRequests: 0,
      topBlockedIPs: [],
      topBlockedEndpoints: [],
      rules: []
    };
    
    // Aggregate statistics from all stores
    for (const [ruleName, store] of this.stores) {
      const ruleStats = store.getStatistics(timeRange);
      stats.totalRequests += ruleStats.totalRequests;
      stats.blockedRequests += ruleStats.blockedRequests;
      
      stats.rules.push({
        name: ruleName,
        ...ruleStats
      });
    }
    
    return stats;
  }

  // Private helper methods
  private initializeDefaultRules(): void {
    // Global API rate limit
    this.addRule({
      name: 'global_api',
      endpoint: '/api/*',
      limit: 1000,
      window: 3600000, // 1 hour
      algorithm: 'sliding_window',
      priority: 1
    });
    
    // Authentication endpoints
    this.addRule({
      name: 'auth_strict',
      endpoint: '/api/auth/*',
      limit: 5,
      window: 900000, // 15 minutes
      algorithm: 'fixed_window',
      priority: 10,
      burstProtection: {
        limit: 3,
        window: 60000 // 1 minute
      }
    });
    
    // Upload endpoints
    this.addRule({
      name: 'upload_limit',
      endpoint: '/api/upload',
      limit: 50,
      window: 3600000, // 1 hour
      algorithm: 'token_bucket',
      priority: 5
    });
    
    // Email campaign endpoints
    this.addRule({
      name: 'email_campaigns',
      endpoint: '/api/email-campaigns/*',
      limit: 100,
      window: 3600000, // 1 hour
      algorithm: 'sliding_window',
      priority: 3
    });
  }

  private getIdentifier(request: RateLimitRequest): string {
    // Use user ID if authenticated, otherwise IP
    return request.userId || request.ip;
  }

  private getRulesForRequest(request: RateLimitRequest): RateLimitRule[] {
    const matchingRules: RateLimitRule[] = [];
    
    for (const [endpoint, rules] of this.rules) {
      if (this.endpointMatches(endpoint, request.endpoint)) {
        matchingRules.push(...rules);
      }
    }
    
    return matchingRules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  private endpointMatches(pattern: string, endpoint: string): boolean {
    if (pattern === '*') return true;
    if (pattern === endpoint) return true;
    
    // Simple wildcard matching
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return regex.test(endpoint);
  }

  private async checkRule(rule: RateLimitRule, identifier: string, request: RateLimitRequest): Promise<RateLimitResult> {
    // Check burst protection first
    const burstResult = await this.burstProtectionCheck(rule, identifier);
    if (!burstResult.allowed) return burstResult;
    
    // Check geographic restrictions
    const geoResult = await this.geographicCheck(rule, request);
    if (!geoResult.allowed) return geoResult;
    
    // Apply the main algorithm
    switch (rule.algorithm) {
      case 'sliding_window':
        return this.slidingWindowCheck(rule, identifier);
      case 'token_bucket':
        return this.tokenBucketCheck(rule, identifier);
      case 'fixed_window':
        return this.fixedWindowCheck(rule, identifier);
      case 'adaptive':
        return this.adaptiveCheck(rule, identifier, request);
      case 'distributed':
        return this.distributedCheck(rule, identifier);
      default:
        return this.slidingWindowCheck(rule, identifier);
    }
  }

  private async checkGlobalLimits(request: RateLimitRequest): Promise<RateLimitResult> {
    // Check global IP limit
    const ipLimit = this.globalLimits.get('ip_global');
    if (ipLimit) {
      const store = this.getStore('global_ip');
      const requests = store.getRequestsInWindow(
        request.ip,
        Date.now() - ipLimit.window,
        Date.now()
      );
      
      if (requests.length >= ipLimit.limit) {
        return {
          allowed: false,
          reason: 'GLOBAL_IP_LIMIT_EXCEEDED',
          resetTime: Date.now() + ipLimit.window,
          retryAfter: Math.ceil(ipLimit.window / 1000)
        };
      }
    }
    
    return { allowed: true };
  }

  private getStore(name: string): RateLimitStore {
    if (!this.stores.has(name)) {
      this.stores.set(name, new InMemoryRateLimitStore());
    }
    return this.stores.get(name)!;
  }

  private async recordRequest(identifier: string, request: RateLimitRequest): Promise<void> {
    // Record in all applicable stores
    const rules = this.getRulesForRequest(request);
    
    for (const rule of rules) {
      const store = this.getStore(rule.name);
      store.recordRequest(identifier, Date.now());
    }
  }

  private async getRemainingCount(rules: RateLimitRule[], identifier: string): Promise<number> {
    let minRemaining = Infinity;
    
    for (const rule of rules) {
      const result = await this.checkRule(rule, identifier, {} as RateLimitRequest);
      if (result.remaining !== undefined && result.remaining < minRemaining) {
        minRemaining = result.remaining;
      }
    }
    
    return minRemaining === Infinity ? 0 : minRemaining;
  }

  private applyLoadBasedLimits(factor: number): void {
    for (const [endpoint, rules] of this.rules) {
      rules.forEach(rule => {
        if (!rule.originalLimit) {
          rule.originalLimit = rule.limit;
        }
        rule.limit = Math.floor(rule.originalLimit * factor);
      });
    }
  }

  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanup();
    }, 300000); // 5 minutes
  }

  private cleanup(): void {
    const now = Date.now();
    const cleanupAge = 3600000; // 1 hour
    
    // Clean up old suspicious activity records
    for (const [ip, activity] of this.suspiciousActivity) {
      if (now - activity.lastViolation > cleanupAge) {
        this.suspiciousActivity.delete(ip);
      }
    }
    
    // Clean up store data
    for (const store of this.stores.values()) {
      store.cleanup();
    }
  }

  // Mock implementations for external services
  private async getSystemLoad(): Promise<number> {
    return Math.random() * 100;
  }

  private async getDatabaseLoad(): Promise<number> {
    return Math.random() * 100;
  }

  private async getDistributedStore(): Promise<any> {
    // Mock Redis client
    return {
      pipeline: () => ({
        incr: () => {},
        expire: () => {},
        exec: () => Promise.resolve([[null, 1]])
      }),
      ttl: () => Promise.resolve(60)
    };
  }

  private async getUserProfile(identifier: string): Promise<any> {
    return {
      tier: 'free',
      reputation: 0.5
    };
  }

  private async getIPLocation(ip: string): Promise<any> {
    return {
      country: 'US',
      region: 'CA'
    };
  }
}

// In-memory rate limit store implementation
class InMemoryRateLimitStore implements RateLimitStore {
  private requests: Map<string, number[]> = new Map();
  private windowCounts: Map<string, { count: number; expiry: number }> = new Map();
  private tokenBuckets: Map<string, TokenBucket> = new Map();

  getRequestsInWindow(identifier: string, windowStart: number, windowEnd: number): number[] {
    const requests = this.requests.get(identifier) || [];
    return requests.filter(time => time >= windowStart && time <= windowEnd);
  }

  recordRequest(identifier: string, timestamp: number): void {
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }
    this.requests.get(identifier)!.push(timestamp);
  }

  getWindowCount(windowKey: string): number {
    const entry = this.windowCounts.get(windowKey);
    if (!entry || Date.now() > entry.expiry) {
      return 0;
    }
    return entry.count;
  }

  incrementWindowCount(windowKey: string, windowDuration: number): void {
    const entry = this.windowCounts.get(windowKey) || { count: 0, expiry: 0 };
    entry.count++;
    entry.expiry = Date.now() + windowDuration;
    this.windowCounts.set(windowKey, entry);
  }

  getTokenBucket(identifier: string): TokenBucket | null {
    return this.tokenBuckets.get(identifier) || null;
  }

  setTokenBucket(identifier: string, bucket: TokenBucket): void {
    this.tokenBuckets.set(identifier, bucket);
  }

  getStatistics(timeRange: string): any {
    return {
      totalRequests: 0,
      blockedRequests: 0
    };
  }

  cleanup(): void {
    const now = Date.now();
    const cleanupAge = 3600000; // 1 hour
    
    // Clean up old requests
    for (const [identifier, requests] of this.requests) {
      const filtered = requests.filter(time => now - time < cleanupAge);
      if (filtered.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, filtered);
      }
    }
    
    // Clean up expired window counts
    for (const [windowKey, entry] of this.windowCounts) {
      if (now > entry.expiry) {
        this.windowCounts.delete(windowKey);
      }
    }
  }
}

// Type definitions
interface RateLimitRequest {
  ip: string;
  userId?: string;
  endpoint: string;
  method: string;
  userAgent?: string;
  headers?: Record<string, string>;
}

interface RateLimitRule {
  name: string;
  endpoint?: string;
  limit: number;
  window: number; // milliseconds
  algorithm: 'sliding_window' | 'token_bucket' | 'fixed_window' | 'adaptive' | 'distributed';
  priority?: number;
  originalLimit?: number;
  distributed?: boolean;
  burstProtection?: {
    limit: number;
    window: number;
  };
  geographic?: Record<string, { limit?: number; window?: number }>;
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  remaining?: number;
  resetTime?: number;
  retryAfter?: number;
  limit?: number;
}

interface RateLimitStore {
  getRequestsInWindow(identifier: string, windowStart: number, windowEnd: number): number[];
  recordRequest(identifier: string, timestamp: number): void;
  getWindowCount(windowKey: string): number;
  incrementWindowCount(windowKey: string, windowDuration: number): void;
  getTokenBucket(identifier: string): TokenBucket | null;
  setTokenBucket(identifier: string, bucket: TokenBucket): void;
  getStatistics(timeRange: string): any;
  cleanup(): void;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

interface GlobalLimit {
  limit: number;
  window: number;
}

interface SuspiciousActivity {
  violations: number;
  firstViolation: number;
  lastViolation: number;
  rules: Set<string>;
}

interface RateLimitStatistics {
  totalRequests: number;
  blockedRequests: number;
  topBlockedIPs: Array<{ ip: string; count: number }>;
  topBlockedEndpoints: Array<{ endpoint: string; count: number }>;
  rules: Array<{ name: string; [key: string]: any }>;
}

// Export singleton instance

// Export singleton instance
export const advancedRateLimiter = new AdvancedRateLimiter();