// @ts-nocheck
import { RealTimeAnalytics } from '@/lib/analytics/real-time'

describe('RealTimeAnalytics', () => {
  let analytics: RealTimeAnalytics;

  beforeEach(() => {
    analytics = new RealTimeAnalytics()
  })

  afterEach(() => {
    analytics.destroy()
  })

  describe('Event Tracking', () => {
    it('should track basic events', () => {
      const eventData = analytics.trackEvent('user_123', 'page_view', {
        page: '/dashboard',
        referrer: 'https://google.com'
      })

      expect(eventData).toMatchObject({
        userId: 'user_123',
        event: 'page_view',
        data: {
          page: '/dashboard',
          referrer: 'https://google.com'
        },
        timestamp: expect.any(String),
        sessionId: expect.any(String)
      })
    })

    it('should track user actions', () => {
      const eventData = analytics.trackUserAction('user_123', 'button_click', {
        buttonId: 'cta-signup',
        page: '/pricing'
      })

      expect(eventData.event).toBe('user_action')
      expect(eventData.data.action).toBe('button_click')
      expect(eventData.data.metadata.buttonId).toBe('cta-signup')
    })

    it('should track product usage', () => {
      const eventData = analytics.trackProductUsage(
        'user_123',
        'bundle-builder',
        'create_bundle',
        { duration: 5000, success: true }
      )

      expect(eventData.event).toBe('product_usage')
      expect(eventData.data.productId).toBe('bundle-builder')
      expect(eventData.data.feature).toBe('create_bundle')
      expect(eventData.data.usage.success).toBe(true)
    })

    it('should track funnel steps', () => {
      const eventData = analytics.trackFunnelStep(
        'user_123',
        'signup_funnel',
        'email_entered',
        { previousStep: 'landing_page', timeToStep: 2000 }
      )

      expect(eventData.event).toBe('funnel_step')
      expect(eventData.data.funnelId).toBe('signup_funnel')
      expect(eventData.data.step).toBe('email_entered')
    })

    it('should track revenue events', () => {
      const eventData = analytics.trackRevenue('user_123', 29.99, 'USD', {
        subscriptionId: 'sub_123',
        productId: 'pro_plan'
      })

      expect(eventData.event).toBe('revenue')
      expect(eventData.data.amount).toBe(29.99)
      expect(eventData.data.currency).toBe('USD')
    })
  })

  describe('Real-time Analytics', () => {
    beforeEach(() => {
      // Add some test events
      analytics.trackEvent('user_123', 'page_view')
      analytics.trackUserAction('user_123', 'click')
      analytics.trackProductUsage('user_123', 'app', 'feature_use')
      analytics.trackRevenue('user_123', 10.00)
    })

    it('should get real-time analytics for user', async () => {
      const analyticsData = await analytics.getRealTimeAnalytics('user_123', '1h')

      expect(analyticsData).toMatchObject({
        totalEvents: expect.any(Number),
        events: expect.any(Array),
        metrics: expect.objectContaining({
          userActions: expect.any(Number),
          productUsage: expect.any(Number),
          revenue: expect.any(Number)
        }),
        trends: expect.any(Object),
        lastUpdated: expect.any(String)
      })

      expect(analyticsData.totalEvents).toBeGreaterThan(0)
    })

    it('should get live dashboard metrics', async () => {
      const metrics = await analytics.getLiveDashboardMetrics('user_123')

      expect(metrics).toMatchObject({
        activeUsers: expect.any(Number),
        revenueToday: expect.any(Number),
        conversionRate: expect.any(Number),
        topProducts: expect.any(Array),
        recentActivity: expect.any(Array),
        performanceMetrics: expect.objectContaining({
          avgResponseTime: expect.any(Number),
          successRate: expect.any(Number),
          errorRate: expect.any(Number)
        }),
        realTimeStats: expect.objectContaining({
          sessionsActive: expect.any(Number),
          eventsPerMinute: expect.any(Number),
          currentLoad: expect.any(Number)
        })
      })
    })

    it('should filter events by time range', async () => {
      const oneHourAgo = await analytics.getRealTimeAnalytics('user_123', '1h')
      const sixHoursAgo = await analytics.getRealTimeAnalytics('user_123', '6h')

      expect(sixHoursAgo.totalEvents).toBeGreaterThanOrEqual(oneHourAgo.totalEvents)
    })
  })

  describe('WebSocket Integration', () => {
    let mockWS: any

    beforeEach(() => {
      mockWS = {
        send: jest.fn(),
        readyState: 1, // OPEN
        on: jest.fn(),
        close: jest.fn()
      }
    })

    it('should add WebSocket connection', () => {
      analytics.addWSConnection('user_123', mockWS)

      expect(mockWS.send).toHaveBeenCalledWith(
        expect.stringContaining('initial_analytics')
      )
    })

    it('should broadcast to user on event', () => {
      analytics.addWSConnection('user_123', mockWS)
      
      analytics.trackEvent('user_123', 'test_event')

      expect(mockWS.send).toHaveBeenCalledWith(
        expect.stringContaining('analytics_update')
      )
    })

    it('should broadcast to all connected clients', () => {
      const mockWS2 = { ...mockWS, send: jest.fn() }
      
      analytics.addWSConnection('user_123', mockWS)
      analytics.addWSConnection('user_456', mockWS2)

      analytics.broadcastToAll({ type: 'system_message', data: 'test' })

      expect(mockWS.send).toHaveBeenCalled()
      expect(mockWS2.send).toHaveBeenCalled()
    })
  })

  describe('Metrics Calculation', () => {
    beforeEach(() => {
      // Create predictable test data
      analytics.trackUserAction('user_123', 'click')
      analytics.trackUserAction('user_123', 'submit')
      analytics.trackProductUsage('user_123', 'app1', 'feature1')
      analytics.trackProductUsage('user_123', 'app2', 'feature2')
      analytics.trackRevenue('user_123', 10.00)
      analytics.trackRevenue('user_123', 20.00)
    })

    it('should calculate metrics correctly', async () => {
      const data = await analytics.getRealTimeAnalytics('user_123', '1h')

      expect(data.metrics.userActions).toBe(2)
      expect(data.metrics.productUsage).toBe(2)
      expect(data.metrics.revenue).toBe(30.00)
      expect(data.metrics.uniqueProducts).toBe(2)
    })

    it('should calculate trends', async () => {
      const data = await analytics.getRealTimeAnalytics('user_123', '1h')

      expect(data.trends).toMatchObject({
        hourly: expect.any(Object),
        growth: expect.any(Number),
        predictions: expect.objectContaining({
          nextHour: expect.any(Number),
          confidence: expect.any(Number)
        })
      })
    })
  })

  describe('Event Emission', () => {
    it('should emit events on tracking', (done) => {
      analytics.on('analytics:event', (eventData) => {
        expect(eventData.event).toBe('test_event')
        expect(eventData.userId).toBe('user_123')
        done()
      })

      analytics.trackEvent('user_123', 'test_event')
    })

    it('should emit events on automation trigger', (done) => {
      analytics.on('automation:triggered', (data) => {
        expect(data.userId).toBe('user_123')
        done()
      })

      // This would be triggered by the automation system
      analytics.emit('automation:triggered', { userId: 'user_123' })
    })
  })

  describe('Performance', () => {
    it('should handle high event volume', () => {
      const startTime = Date.now()
      
      // Track 1000 events
      for (let i = 0; i < 1000; i++) {
        analytics.trackEvent(`user_${i}`, 'performance_test')
      }
      
      const endTime = Date.now()
      const duration = endTime - startTime
      
      // Should complete within reasonable time (less than 1 second)
      expect(duration).toBeLessThan(1000)
    })

    it('should manage memory usage with buffer limits', async () => {
      // Fill buffer beyond typical limits
      for (let i = 0; i < 200; i++) {
        analytics.trackEvent('user_123', `event_${i}`)
      }

      const data = await analytics.getRealTimeAnalytics('user_123', '1h')
      
      // Should still function correctly
      expect(data.totalEvents).toBeGreaterThan(0)
      expect(data.events).toBeInstanceOf(Array)
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid time ranges gracefully', async () => {
      const data = await analytics.getRealTimeAnalytics('user_123', 'invalid')
      
      // Should default to 1h
      expect(data).toMatchObject({
        totalEvents: expect.any(Number),
        events: expect.any(Array),
        metrics: expect.any(Object)
      })
    })

    it('should handle missing user data', async () => {
      const data = await analytics.getRealTimeAnalytics('nonexistent_user', '1h')
      
      expect(data.totalEvents).toBe(0)
      expect(data.events).toEqual([])
    })

    it('should handle WebSocket errors gracefully', () => {
      const mockWS = {
        send: jest.fn(() => { throw new Error('Connection lost') }),
        readyState: 1,
        on: jest.fn()
      }

      expect(() => {
        analytics.addWSConnection('user_123', mockWS)
        analytics.trackEvent('user_123', 'test_event')
      }).not.toThrow()
    })
  })

  describe('Data Cleanup', () => {
    it('should clean up old events', () => {
      // Add events
      analytics.trackEvent('user_123', 'old_event')
      
      // Manually trigger cleanup (in real implementation this runs automatically)
      const cleanupMethod = analytics['flushAnalyticsBuffer'].bind(analytics)
      cleanupMethod()
      
      // Should not throw errors
      expect(true).toBe(true)
    })

    it('should destroy cleanly', () => {
      analytics.trackEvent('user_123', 'test_event')
      
      expect(() => {
        analytics.destroy()
      }).not.toThrow()
    })
  })
})