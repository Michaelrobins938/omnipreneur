// @ts-nocheck
import { emailAutomationEngine } from '@/lib/email/automation-engine'

describe('Email Automation Integration', () => {
  beforeEach(() => {
    // Clean state before each test
    emailAutomationEngine.removeAllListeners()
  })

  afterEach(() => {
    // Clean up after tests
    emailAutomationEngine.destroy()
  })

  describe('Campaign Lifecycle', () => {
    it('should create, schedule, and execute a campaign', async () => {
      // Create campaign
      const campaign = await emailAutomationEngine.createCampaign({
        userId: 'user_123',
        name: 'Test Campaign',
        type: 'newsletter',
        subject: 'Test Subject',
        content: 'Test content',
        recipientSegment: 'all',
        scheduledAt: new Date(Date.now() + 1000) // 1 second from now
      })

      expect(campaign).toMatchObject({
        id: expect.any(String),
        name: 'Test Campaign',
        status: 'draft',
        userId: 'user_123'
      })

      // Wait for execution
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Check if campaign was executed
      const executedCampaign = await emailAutomationEngine.getCampaignAnalytics(campaign.id)
      expect(executedCampaign).toBeDefined()
    })

    it('should handle campaign updates', async () => {
      const campaign = await emailAutomationEngine.createCampaign({
        userId: 'user_123',
        name: 'Original Name',
        type: 'promotional',
        subject: 'Original Subject',
        content: 'Original content',
        recipientSegment: 'all'
      })

      const updatedCampaign = await emailAutomationEngine.updateCampaign(campaign.id, {
        name: 'Updated Name',
        subject: 'Updated Subject'
      })

      expect(updatedCampaign?.name).toBe('Updated Name')
      expect(updatedCampaign?.subject).toBe('Updated Subject')
      expect(updatedCampaign?.content).toBe('Original content') // Should remain unchanged
    })

    it('should delete campaigns', async () => {
      const campaign = await emailAutomationEngine.createCampaign({
        userId: 'user_123',
        name: 'To Be Deleted',
        type: 'welcome',
        subject: 'Welcome!',
        content: 'Welcome content',
        recipientSegment: 'new_users'
      })

      const deleted = await emailAutomationEngine.deleteCampaign(campaign.id)
      expect(deleted).toBe(true)

      // Should throw error when trying to get analytics for deleted campaign
      await expect(
        emailAutomationEngine.getCampaignAnalytics(campaign.id)
      ).rejects.toThrow()
    })
  })

  describe('Automation Workflows', () => {
    it('should create and trigger automation', async () => {
      const automation = await emailAutomationEngine.createAutomation({
        name: 'Welcome Series',
        description: 'Send welcome emails to new users',
        triggers: [
          {
            type: 'user_signup',
            conditions: {},
            delay: 0
          }
        ],
        actions: [
          {
            type: 'send_email',
            data: {
              templateId: 'welcome_email',
              subject: 'Welcome!',
              content: 'Welcome to our platform!'
            },
            delay: 0
          }
        ]
      })

      expect(automation).toMatchObject({
        id: expect.any(String),
        name: 'Welcome Series',
        status: 'active',
        triggers: expect.arrayContaining([
          expect.objectContaining({
            type: 'user_signup'
          })
        ])
      })

      // Trigger the automation
      const triggered = await emailAutomationEngine.triggerAutomation(
        automation.id,
        'new_user_123',
        { signupDate: new Date().toISOString() }
      )

      expect(triggered).toBe(true)

      // Check automation metrics
      const analytics = await emailAutomationEngine.getAutomationAnalytics(automation.id)
      expect(analytics.metrics.triggered).toBe(1)
    })

    it('should handle complex automation workflows', async () => {
      const automation = await emailAutomationEngine.createAutomation({
        name: 'Abandoned Cart Recovery',
        triggers: [
          {
            type: 'custom_event',
            conditions: { eventName: 'cart_abandoned' },
            delay: 0
          }
        ],
        actions: [
          {
            type: 'send_email',
            data: {
              subject: 'You left items in your cart',
              content: 'Come back and complete your purchase!'
            },
            delay: 3600000 // 1 hour delay
          },
          {
            type: 'send_email',
            data: {
              subject: 'Last chance - 10% off your cart',
              content: 'Use code SAVE10 to complete your purchase'
            },
            delay: 86400000 // 24 hour delay
          }
        ]
      })

      // Trigger cart abandonment
      const triggered = await emailAutomationEngine.triggerAutomation(
        automation.id,
        'user_456',
        {
          cartValue: 99.99,
          items: ['product_1', 'product_2']
        }
      )

      expect(triggered).toBe(true)

      const analytics = await emailAutomationEngine.getAutomationAnalytics(automation.id)
      expect(analytics.metrics.triggered).toBe(1)
      expect(analytics.metrics.active).toBe(1) // Should be in progress
    })
  })

  describe('Recurring Campaigns', () => {
    it('should schedule recurring campaigns', async () => {
      const recurringId = await emailAutomationEngine.scheduleRecurringCampaign(
        {
          userId: 'user_123',
          name: 'Weekly Newsletter',
          type: 'newsletter',
          subject: 'Weekly Update {{date}}',
          content: 'This weeks newsletter content',
          recipientSegment: 'subscribers'
        },
        {
          frequency: 'weekly',
          time: '09:00'
        }
      )

      expect(recurringId).toBeDefined()
      expect(typeof recurringId).toBe('string')
    })
  })

  describe('A/B Testing', () => {
    it('should create and execute A/B tests', async () => {
      const abTest = await emailAutomationEngine.createABTest(
        {
          userId: 'user_123',
          name: 'Subject Line Test',
          type: 'promotional',
          subject: 'Default Subject',
          content: 'Test content',
          recipientSegment: 'all'
        },
        [
          {
            name: 'Variant A',
            subject: 'Buy Now - Limited Time!',
            content: 'Urgent purchase content',
            allocation: 50
          },
          {
            name: 'Variant B',
            subject: 'Special Offer Just for You',
            content: 'Personalized offer content',
            allocation: 50
          }
        ]
      )

      expect(abTest).toMatchObject({
        id: expect.any(String),
        name: 'A/B Test: Subject Line Test',
        variants: expect.arrayContaining([
          expect.objectContaining({
            name: 'Variant A',
            allocation: 50
          }),
          expect.objectContaining({
            name: 'Variant B',
            allocation: 50
          })
        ])
      })

      // Execute the A/B test
      await emailAutomationEngine.executeABTest(abTest.id)

      // Should create campaigns for each variant
      expect(abTest.variants[0].campaignId).toBeDefined()
      expect(abTest.variants[1].campaignId).toBeDefined()
    })
  })

  describe('Event-Driven Automation', () => {
    it('should respond to user signup events', (done) => {
      emailAutomationEngine.createAutomation({
        name: 'Signup Automation',
        triggers: [
          {
            type: 'user_signup',
            conditions: {}
          }
        ],
        actions: [
          {
            type: 'send_email',
            data: {
              subject: 'Welcome aboard!',
              content: 'Thanks for signing up'
            }
          }
        ]
      }).then((automation) => {
        // Listen for automation trigger
        emailAutomationEngine.on('automation:triggered', (data) => {
          expect(data.automation.id).toBe(automation.id)
          expect(data.userId).toBe('new_user_789')
          done()
        })

        // Emit signup event
        emailAutomationEngine.emit('user:signup', {
          userId: 'new_user_789',
          email: 'newuser@example.com',
          signupDate: new Date().toISOString()
        })
      })
    })

    it('should respond to purchase events', (done) => {
      emailAutomationEngine.createAutomation({
        name: 'Purchase Follow-up',
        triggers: [
          {
            type: 'purchase',
            conditions: { minimumAmount: 50 }
          }
        ],
        actions: [
          {
            type: 'send_email',
            data: {
              subject: 'Thank you for your purchase!',
              content: 'We appreciate your business'
            }
          }
        ]
      }).then((automation) => {
        emailAutomationEngine.on('automation:triggered', (data) => {
          expect(data.triggerData.amount).toBe(99.99)
          done()
        })

        // Emit purchase event
        emailAutomationEngine.emit('user:purchase', {
          userId: 'customer_123',
          amount: 99.99,
          productId: 'premium_plan'
        })
      })
    })
  })

  describe('Content Personalization', () => {
    it('should personalize email content', async () => {
      const campaign = await emailAutomationEngine.createCampaign({
        userId: 'user_123',
        name: 'Personalized Campaign',
        type: 'promotional',
        subject: 'Hello {{name}}!',
        content: 'Hi {{first_name}}, check out our new features at {{company}}!',
        recipientSegment: 'all'
      })

      // Mock recipient data
      const recipient = {
        id: 'recipient_1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        firstName: 'John',
        lastName: 'Doe',
        company: 'Tech Corp'
      }

      // Get the personalization method (normally private)
      const personalizeMethod = emailAutomationEngine['personalizeContent'].bind(emailAutomationEngine)
      const personalized = await personalizeMethod(campaign, recipient)

      expect(personalized.subject).toBe('Hello John Doe!')
      expect(personalized.content).toContain('Hi John,')
      expect(personalized.content).toContain('at Tech Corp!')
    })
  })

  describe('Analytics and Reporting', () => {
    it('should provide campaign analytics', async () => {
      const campaign = await emailAutomationEngine.createCampaign({
        userId: 'user_123',
        name: 'Analytics Test',
        type: 'newsletter',
        subject: 'Test Newsletter',
        content: 'Newsletter content',
        recipientSegment: 'all'
      })

      // Execute campaign to generate metrics
      await emailAutomationEngine.executeCampaign(campaign.id)

      const analytics = await emailAutomationEngine.getCampaignAnalytics(campaign.id)

      expect(analytics).toMatchObject({
        campaignId: campaign.id,
        metrics: expect.objectContaining({
          sent: expect.any(Number),
          delivered: expect.any(Number),
          opened: expect.any(Number),
          clicked: expect.any(Number)
        }),
        timeline: expect.any(Array),
        engagement: expect.any(Object),
        deliverability: expect.any(Object)
      })
    })

    it('should provide automation analytics', async () => {
      const automation = await emailAutomationEngine.createAutomation({
        name: 'Analytics Automation',
        triggers: [{ type: 'user_signup', conditions: {} }],
        actions: [
          {
            type: 'send_email',
            data: { subject: 'Welcome', content: 'Welcome!' }
          }
        ]
      })

      // Trigger automation multiple times
      await emailAutomationEngine.triggerAutomation(automation.id, 'user_1')
      await emailAutomationEngine.triggerAutomation(automation.id, 'user_2')

      const analytics = await emailAutomationEngine.getAutomationAnalytics(automation.id)

      expect(analytics).toMatchObject({
        automationId: automation.id,
        metrics: expect.objectContaining({
          triggered: 2,
          completed: expect.any(Number),
          active: expect.any(Number)
        }),
        flowAnalysis: expect.any(Object),
        conversionFunnel: expect.any(Object)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid campaign data', async () => {
      await expect(
        emailAutomationEngine.createCampaign({
          userId: '', // Invalid
          name: '',   // Invalid
          type: 'invalid', // Invalid
          subject: '',
          content: '',
          recipientSegment: ''
        })
      ).rejects.toThrow()
    })

    it('should handle automation execution errors gracefully', async () => {
      const automation = await emailAutomationEngine.createAutomation({
        name: 'Error Test',
        triggers: [{ type: 'user_signup', conditions: {} }],
        actions: [
          {
            type: 'send_email',
            data: { subject: 'Test', content: 'Test' }
          }
        ]
      })

      // Trigger with invalid user data
      const result = await emailAutomationEngine.triggerAutomation(
        automation.id,
        '', // Invalid user ID
        {}
      )

      // Should handle gracefully
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Performance', () => {
    it('should handle multiple concurrent campaigns', async () => {
      const campaigns = []
      
      // Create multiple campaigns concurrently
      const createPromises = Array.from({ length: 10 }, (_, i) =>
        emailAutomationEngine.createCampaign({
          userId: 'user_123',
          name: `Concurrent Campaign ${i}`,
          type: 'newsletter',
          subject: `Subject ${i}`,
          content: `Content ${i}`,
          recipientSegment: 'all'
        })
      )

      const results = await Promise.all(createPromises)
      expect(results).toHaveLength(10)
      
      results.forEach((campaign, i) => {
        expect(campaign.name).toBe(`Concurrent Campaign ${i}`)
      })
    })

    it('should handle high-volume automation triggers', async () => {
      const automation = await emailAutomationEngine.createAutomation({
        name: 'High Volume Test',
        triggers: [{ type: 'user_signup', conditions: {} }],
        actions: [
          {
            type: 'send_email',
            data: { subject: 'Welcome', content: 'Welcome!' }
          }
        ]
      })

      // Trigger automation for many users
      const triggerPromises = Array.from({ length: 100 }, (_, i) =>
        emailAutomationEngine.triggerAutomation(automation.id, `user_${i}`)
      )

      const results = await Promise.all(triggerPromises)
      
      // All should succeed
      expect(results.every(result => result === true)).toBe(true)

      const analytics = await emailAutomationEngine.getAutomationAnalytics(automation.id)
      expect(analytics.metrics.triggered).toBe(100)
    })
  })
})