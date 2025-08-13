// @ts-nocheck
import { AdvancedRateLimiter } from '@/lib/rate-limit/advanced-limiter'

describe('AdvancedRateLimiter', () => {
  let limiter: AdvancedRateLimiter;

  beforeEach(() => {
    limiter = new AdvancedRateLimiter()
  })

  afterEach(() => {
    limiter.destroy()
  })

  describe('Basic Rate Limiting', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'test_rule',
        endpoint: '/test',
        limit: 3,
        window: 60000, // 1 minute
        algorithm: 'sliding_window',
        priority: 1
      })
    })

    it('should allow requests within limit', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/test',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('should block requests exceeding limit', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/test',
        method: 'GET'
      }

      // Use up the limit
      await limiter.checkLimit(request)
      await limiter.checkLimit(request)
      await limiter.checkLimit(request)

      // This should be blocked
      const result = await limiter.checkLimit(request)

      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('RATE_LIMIT_EXCEEDED')
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it('should track remaining requests correctly', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/test',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)

      expect(result1.remaining).toBe(2)
      expect(result2.remaining).toBe(1)
    })
  })

  describe('Multiple Algorithms', () => {
    it('should work with sliding window algorithm', async () => {
      limiter.addRule({
        name: 'sliding_test',
        endpoint: '/sliding',
        limit: 2,
        window: 1000,
        algorithm: 'sliding_window'
      })

      const request = {
        ip: '192.168.1.1',
        endpoint: '/sliding',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false)
    })

    it('should work with token bucket algorithm', async () => {
      limiter.addRule({
        name: 'bucket_test',
        endpoint: '/bucket',
        limit: 2,
        window: 1000,
        algorithm: 'token_bucket'
      })

      const request = {
        ip: '192.168.1.1',
        endpoint: '/bucket',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false)
    })

    it('should work with fixed window algorithm', async () => {
      limiter.addRule({
        name: 'fixed_test',
        endpoint: '/fixed',
        limit: 2,
        window: 1000,
        algorithm: 'fixed_window'
      })

      const request = {
        ip: '192.168.1.1',
        endpoint: '/fixed',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false)
    })
  })

  describe('Burst Protection', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'burst_test',
        endpoint: '/burst',
        limit: 10,
        window: 60000,
        algorithm: 'sliding_window',
        burstProtection: {
          limit: 2,
          window: 1000
        }
      })
    })

    it('should block burst requests', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/burst',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false)
      expect(result3.reason).toBe('BURST_LIMIT_EXCEEDED')
    })
  })

  describe('Whitelist/Blacklist', () => {
    it('should bypass limits for whitelisted IPs', async () => {
      limiter.addRule({
        name: 'whitelist_test',
        endpoint: '/whitelist',
        limit: 1,
        window: 60000,
        algorithm: 'sliding_window'
      })

      limiter.addToWhitelist('192.168.1.100')

      const request = {
        ip: '192.168.1.100',
        endpoint: '/whitelist',
        method: 'GET'
      }

      // Should allow unlimited requests
      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result1.reason).toBe('WHITELISTED')
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
    })

    it('should block blacklisted IPs', async () => {
      limiter.addToBlacklist('192.168.1.200')

      const request = {
        ip: '192.168.1.200',
        endpoint: '/test',
        method: 'GET'
      }

      const result = await limiter.checkLimit(request)

      expect(result.allowed).toBe(false)
      expect(result.reason).toBe('IP_BLACKLISTED')
    })

    it('should remove IPs from whitelist', async () => {
      limiter.addToWhitelist('192.168.1.100')
      limiter.removeFromWhitelist('192.168.1.100')

      limiter.addRule({
        name: 'remove_test',
        endpoint: '/remove',
        limit: 1,
        window: 60000,
        algorithm: 'sliding_window'
      })

      const request = {
        ip: '192.168.1.100',
        endpoint: '/remove',
        method: 'GET'
      }

      // Should now be subject to rate limits
      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(false)
    })
  })

  describe('Rule Priority', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'low_priority',
        endpoint: '/priority',
        limit: 10,
        window: 60000,
        algorithm: 'sliding_window',
        priority: 1
      })

      limiter.addRule({
        name: 'high_priority',
        endpoint: '/priority',
        limit: 2,
        window: 60000,
        algorithm: 'sliding_window',
        priority: 10
      })
    })

    it('should apply highest priority rule first', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/priority',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false) // Blocked by high priority rule (limit: 2)
    })
  })

  describe('Endpoint Matching', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'exact_match',
        endpoint: '/api/users',
        limit: 2,
        window: 60000,
        algorithm: 'sliding_window'
      })

      limiter.addRule({
        name: 'wildcard_match',
        endpoint: '/api/auth/*',
        limit: 1,
        window: 60000,
        algorithm: 'sliding_window'
      })
    })

    it('should match exact endpoints', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/api/users',
        method: 'GET'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)
      const result3 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(false)
    })

    it('should match wildcard endpoints', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/api/auth/login',
        method: 'POST'
      }

      const result1 = await limiter.checkLimit(request)
      const result2 = await limiter.checkLimit(request)

      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(false)
    })

    it('should not match unrelated endpoints', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/different/path',
        method: 'GET'
      }

      // Should only match global rules (if any)
      const result = await limiter.checkLimit(request)
      expect(result.allowed).toBe(true) // No specific rules match
    })
  })

  describe('User-based Rate Limiting', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'user_test',
        endpoint: '/user',
        limit: 2,
        window: 60000,
        algorithm: 'sliding_window'
      })
    })

    it('should rate limit by user ID when provided', async () => {
      const request1 = {
        ip: '192.168.1.1',
        userId: 'user_123',
        endpoint: '/user',
        method: 'GET'
      }

      const request2 = {
        ip: '192.168.1.1',
        userId: 'user_456',
        endpoint: '/user',
        method: 'GET'
      }

      // Same IP, different users - should be tracked separately
      const result1a = await limiter.checkLimit(request1)
      const result1b = await limiter.checkLimit(request1)
      const result1c = await limiter.checkLimit(request1)

      const result2a = await limiter.checkLimit(request2)
      const result2b = await limiter.checkLimit(request2)

      expect(result1a.allowed).toBe(true)
      expect(result1b.allowed).toBe(true)
      expect(result1c.allowed).toBe(false) // user_123 exceeded limit

      expect(result2a.allowed).toBe(true) // user_456 still has quota
      expect(result2b.allowed).toBe(true)
    })
  })

  describe('Statistics', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'stats_test',
        endpoint: '/stats',
        limit: 2,
        window: 60000,
        algorithm: 'sliding_window'
      })
    })

    it('should provide rate limiting statistics', async () => {
      const request = {
        ip: '192.168.1.1',
        endpoint: '/stats',
        method: 'GET'
      }

      // Generate some traffic
      await limiter.checkLimit(request)
      await limiter.checkLimit(request)
      await limiter.checkLimit(request) // This should be blocked

      const stats = await limiter.getStatistics('1h')

      expect(stats).toMatchObject({
        totalRequests: expect.any(Number),
        blockedRequests: expect.any(Number),
        topBlockedIPs: expect.any(Array),
        topBlockedEndpoints: expect.any(Array),
        rules: expect.any(Array)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid rules gracefully', () => {
      expect(() => {
        limiter.addRule({
          name: 'invalid_rule',
          endpoint: '/invalid',
          limit: -1, // Invalid limit
          window: 0, // Invalid window
          algorithm: 'invalid_algorithm' as any
        })
      }).not.toThrow()
    })

    it('should handle malformed requests', async () => {
      const request = {
        ip: '', // Empty IP
        endpoint: '', // Empty endpoint
        method: ''
      }

      const result = await limiter.checkLimit(request)
      expect(result).toMatchObject({
        allowed: expect.any(Boolean)
      })
    })
  })

  describe('Memory Management', () => {
    it('should clean up old data', () => {
      // Add some data
      limiter.addRule({
        name: 'cleanup_test',
        endpoint: '/cleanup',
        limit: 100,
        window: 1000, // Short window for testing
        algorithm: 'sliding_window'
      })

      // Simulate cleanup
      expect(() => {
        limiter['cleanup']()
      }).not.toThrow()
    })
  })

  describe('Event Emission', () => {
    beforeEach(() => {
      limiter.addRule({
        name: 'event_test',
        endpoint: '/events',
        limit: 1,
        window: 60000,
        algorithm: 'sliding_window'
      })
    })

    it('should emit rate limit events', (done) => {
      limiter.on('rateLimit:exceeded', (data) => {
        expect(data.rule).toBe('event_test')
        expect(data.identifier).toBe('192.168.1.1')
        done()
      })

      const request = {
        ip: '192.168.1.1',
        endpoint: '/events',
        method: 'GET'
      }

      // Use up limit and trigger event
      limiter.checkLimit(request).then(() => {
        limiter.checkLimit(request) // This should trigger the event
      })
    })
  })
})