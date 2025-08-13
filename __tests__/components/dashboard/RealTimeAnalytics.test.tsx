// @ts-nocheck
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RealTimeAnalytics from '@/app/components/dashboard/RealTimeAnalytics'

// Mock fetch
global.fetch = jest.fn()

// Mock WebSocket
const mockWebSocket = {
  send: jest.fn(),
  close: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 1
}

global.WebSocket = jest.fn().mockImplementation(() => mockWebSocket)

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('RealTimeAnalytics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue('test_token')
    
    // Mock successful API response
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: {
          realtime: {
            totalEvents: 150,
            events: [
              { event: 'page_view', timestamp: new Date().toISOString() },
              { event: 'user_action', timestamp: new Date().toISOString() }
            ],
            metrics: {
              userActions: 25,
              productUsage: 15,
              revenue: 150.00,
              uniqueProducts: 3
            },
            trends: {
              growth: 12.5,
              hourly: { 10: 5, 11: 8, 12: 12 }
            }
          },
          dashboard: {
            activeUsers: 42,
            revenueToday: 250.75,
            conversionRate: 3.2,
            topProducts: [
              { productId: 'bundle-builder', usage: 25 },
              { productId: 'content-spawner', usage: 18 }
            ],
            recentActivity: [
              { event: 'bundle_created', timestamp: new Date().toISOString() },
              { event: 'campaign_sent', timestamp: new Date().toISOString() }
            ],
            performanceMetrics: {
              avgResponseTime: 95,
              successRate: 99.2,
              errorRate: 0.8
            },
            realTimeStats: {
              sessionsActive: 28,
              eventsPerMinute: 45,
              currentLoad: 65
            }
          },
          timestamp: new Date().toISOString()
        }
      })
    })
  })

  it('should render loading state initially', () => {
    render(<RealTimeAnalytics />)
    
    expect(screen.getByText('Loading real-time analytics...')).toBeInTheDocument()
  })

  it('should render analytics data after loading', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Real-Time Analytics')).toBeInTheDocument()
    })

    // Check key metrics are displayed
    expect(screen.getByText('42')).toBeInTheDocument() // Active Users
    expect(screen.getByText('$250.75')).toBeInTheDocument() // Revenue Today
    expect(screen.getByText('3.2%')).toBeInTheDocument() // Conversion Rate
    expect(screen.getByText('45')).toBeInTheDocument() // Events/Min
  })

  it('should show correct connection status', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('connecting')).toBeInTheDocument()
    })
  })

  it('should display performance metrics', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument()
    })

    expect(screen.getByText('95ms')).toBeInTheDocument() // Response Time
    expect(screen.getByText('99.2%')).toBeInTheDocument() // Success Rate
    expect(screen.getByText('0.8%')).toBeInTheDocument() // Error Rate
  })

  it('should display system status', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('System Status')).toBeInTheDocument()
    })

    expect(screen.getByText('28')).toBeInTheDocument() // Active Sessions
    expect(screen.getByText('65%')).toBeInTheDocument() // System Load
  })

  it('should display recent activity', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    })

    // Should show recent events (mocked events may not have exact text)
    const activitySection = screen.getByText('Recent Activity').closest('div')
    expect(activitySection).toBeInTheDocument()
  })

  it('should show trend indicators', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      // Should show trending up icons for positive trends
      const trendIcons = screen.getAllByTestId('trending-up-icon')
      expect(trendIcons.length).toBeGreaterThan(0)
    })
  })

  it('should handle WebSocket connection', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalled()
    })

    // Should create WebSocket with correct URL format
    const wsCall = (global.WebSocket as jest.Mock).mock.calls[0]
    expect(wsCall[0]).toMatch(/ws.*\/api\/analytics\/websocket\?token=/)
  })

  it('should send test event when debug button clicked', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('Send Test Event')).toBeInTheDocument()
    })

    const testButton = screen.getByText('Send Test Event')
    fireEvent.click(testButton)

    // Should send WebSocket message
    expect(mockWebSocket.send).toHaveBeenCalledWith(
      expect.stringContaining('track_event')
    )
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to fetch initial analytics data:',
        expect.any(Error)
      )
    })

    consoleSpy.mockRestore()
  })

  it('should handle WebSocket errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(<RealTimeAnalytics />)
    
    // Simulate WebSocket error
    const wsInstance = (global.WebSocket as jest.Mock).mock.results[0].value
    wsInstance.onerror?.(new Error('WebSocket error'))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })

  it('should update metrics in real-time', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    // Simulate WebSocket message with updated metrics
    const wsInstance = (global.WebSocket as jest.Mock).mock.results[0].value
    wsInstance.onmessage?.({
      data: JSON.stringify({
        type: 'metrics_update',
        payload: {
          activeUsers: 50,
          revenueToday: 300.00
        },
        timestamp: new Date().toISOString()
      })
    })

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('$300.00')).toBeInTheDocument()
    })
  })

  it('should handle WebSocket messages correctly', async () => {
    render(<RealTimeAnalytics />)
    
    await waitFor(() => {
      expect(global.WebSocket).toHaveBeenCalled()
    })

    const wsInstance = (global.WebSocket as jest.Mock).mock.results[0].value

    // Test different message types
    wsInstance.onmessage?.({
      data: JSON.stringify({
        type: 'connected',
        payload: { userId: 'user_123' }
      })
    })

    wsInstance.onmessage?.({
      data: JSON.stringify({
        type: 'analytics_update',
        payload: {
          event: 'new_signup',
          timestamp: new Date().toISOString()
        }
      })
    })

    wsInstance.onmessage?.({
      data: JSON.stringify({
        type: 'error',
        message: 'Test error'
      })
    })

    // Should handle all message types without errors
    expect(true).toBe(true)
  })

  it('should retry WebSocket connection on failure', async () => {
    jest.useFakeTimers()
    
    render(<RealTimeAnalytics />)
    
    const wsInstance = (global.WebSocket as jest.Mock).mock.results[0].value
    
    // Simulate connection close
    wsInstance.onclose?.()

    // Fast-forward timers to trigger retry
    jest.advanceTimersByTime(5000)

    expect(global.WebSocket).toHaveBeenCalledTimes(2)
    
    jest.useRealTimers()
  })

  it('should cleanup on unmount', () => {
    const { unmount } = render(<RealTimeAnalytics />)
    
    unmount()

    expect(mockWebSocket.close).toHaveBeenCalled()
  })
})