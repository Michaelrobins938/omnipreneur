// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { realTimeAnalytics } from '@/lib/analytics/real-time';
import { z } from 'zod';

const TrackEventSchema = z.object({
  event: z.string().min(1),
  data: z.record(z.any()).optional(),
  category: z.enum(['user_action', 'product_usage', 'funnel_step', 'revenue', 'error']).optional()
});

const GetAnalyticsSchema = z.object({
  timeRange: z.enum(['1h', '6h', '24h', '7d']).default('24h'),
  metrics: z.array(z.string()).optional()
});

/**
 * POST /api/analytics/real-time
 * 
 * Track real-time analytics events
 * 
 * Authentication: Required
 */
export const POST = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const { event, data, category } = TrackEventSchema.parse(body);
    
    // Track the event based on category
    let trackedEvent;
    
    switch (category) {
      case 'user_action':
        trackedEvent = realTimeAnalytics.trackUserAction(
          user.userId, 
          event, 
          data || {}
        );
        break;
        
      case 'product_usage':
        trackedEvent = realTimeAnalytics.trackProductUsage(
          user.userId,
          data?.productId || 'unknown',
          event,
          data || {}
        );
        break;
        
      case 'funnel_step':
        trackedEvent = realTimeAnalytics.trackFunnelStep(
          user.userId,
          data?.funnelId || 'default',
          event,
          data || {}
        );
        break;
        
      case 'revenue':
        trackedEvent = realTimeAnalytics.trackRevenue(
          user.userId,
          data?.amount || 0,
          data?.currency || 'USD',
          data || {}
        );
        break;
        
      default:
        trackedEvent = realTimeAnalytics.trackEvent(
          user.userId,
          event,
          data || {}
        );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        eventId: trackedEvent.timestamp,
        tracked: true,
        event: trackedEvent
      }
    });
    
  } catch (error) {
    console.error('Real-time analytics tracking error:', error);
    
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'TRACKING_ERROR', 
          message: 'Failed to track analytics event' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * GET /api/analytics/real-time
 * 
 * Get real-time analytics data
 * 
 * Authentication: Required
 * 
 * Query Parameters:
 * - timeRange: '1h' | '6h' | '24h' | '7d' (default: '24h')
 * - metrics: Array of specific metrics to include
 */
export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const queryData = GetAnalyticsSchema.parse({
      timeRange: searchParams.get('timeRange') || '24h',
      metrics: searchParams.get('metrics')?.split(',') || undefined
    });
    
    // Import the actual implementation
    const { realTimeAnalytics } = await import('@/lib/analytics/real-time-analytics');
    
    // Get comprehensive real-time analytics
    const [
      realtimeData,
      liveDashboard
    ] = await Promise.all([
      realTimeAnalytics.getRealTimeAnalytics(user.userId, queryData.timeRange),
      realTimeAnalytics.getLiveDashboardMetrics(user.userId)
    ]);
    
    // Filter metrics if specified
    let responseData = {
      realtime: realtimeData,
      dashboard: liveDashboard,
      timestamp: new Date().toISOString()
    };
    
    if (queryData.metrics && queryData.metrics.length > 0) {
      responseData = this.filterMetrics(responseData, queryData.metrics);
    }
    
    return NextResponse.json({
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('Real-time analytics fetch error:', error);
    
    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch analytics data' 
        } 
      },
      { status: 500 }
    );
  }
});

/**
 * Helper function to filter metrics based on requested fields
 */
function filterMetrics(data: any, requestedMetrics: string[]): any {
  const filtered = { ...data };
  
  // Define available metric categories
  const metricCategories = {
    'user_actions': ['dashboard.recentActivity', 'realtime.metrics.userActions'],
    'revenue': ['dashboard.revenueToday', 'realtime.metrics.revenue'],
    'products': ['dashboard.topProducts', 'realtime.metrics.uniqueProducts'],
    'performance': ['dashboard.performanceMetrics'],
    'live_stats': ['dashboard.realTimeStats'],
    'trends': ['realtime.trends']
  };
  
  // Filter based on requested metrics
  requestedMetrics.forEach(metric => {
    if (metricCategories[metric as keyof typeof metricCategories]) {
      // Keep specified metric paths
    } else {
      // Remove unrequested metrics from response
      delete filtered.dashboard[metric];
      delete filtered.realtime.metrics[metric];
    }
  });
  
  return filtered;
}