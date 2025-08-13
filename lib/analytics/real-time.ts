// @ts-nocheck
import { EventEmitter } from 'events';

// Real-time analytics engine with WebSocket support
export class RealTimeAnalytics extends EventEmitter {
  private wsConnections: Map<string, WebSocket> = new Map();
  private analyticsBuffer: Map<string, any[]> = new Map();
  private flushInterval: NodeJS.Timer | null = null;

  constructor() {
    super();
    this.startFlushTimer();
  }

  // Track real-time events
  trackEvent(userId: string, event: string, data: any = {}) {
    const timestamp = new Date().toISOString();
    const eventData = {
      userId,
      event,
      data,
      timestamp,
      sessionId: this.getSessionId(userId)
    };

    // Add to buffer
    if (!this.analyticsBuffer.has(userId)) {
      this.analyticsBuffer.set(userId, []);
    }
    this.analyticsBuffer.get(userId)!.push(eventData);

    // Broadcast real-time update to connected clients
    this.broadcastToUser(userId, {
      event: eventData,
      analytics: this.getRealTimeAnalytics(userId)
    });

    // Emit real-time update
    this.emit('analytics:event', eventData);

    // Send to connected clients
    this.broadcastToUser(userId, {
      type: 'analytics_update',
      payload: eventData
    });

    return eventData;
  }

  // Track user behavior in real-time
  trackUserAction(userId: string, action: string, metadata: any = {}) {
    return this.trackEvent(userId, 'user_action', {
      action,
      metadata,
      userAgent: metadata.userAgent,
      page: metadata.page,
      referrer: metadata.referrer
    });
  }

  // Track product usage
  trackProductUsage(userId: string, productId: string, feature: string, usage: any = {}) {
    return this.trackEvent(userId, 'product_usage', {
      productId,
      feature,
      usage,
      duration: usage.duration,
      success: usage.success
    });
  }

  // Track conversion funnel steps
  trackFunnelStep(userId: string, funnelId: string, step: string, data: any = {}) {
    return this.trackEvent(userId, 'funnel_step', {
      funnelId,
      step,
      data,
      previousStep: data.previousStep,
      timeToStep: data.timeToStep
    });
  }

  // Track revenue events
  trackRevenue(userId: string, amount: number, currency: string = 'USD', metadata: any = {}) {
    return this.trackEvent(userId, 'revenue', {
      amount,
      currency,
      metadata,
      subscriptionId: metadata.subscriptionId,
      productId: metadata.productId,
      upgradeFrom: metadata.upgradeFrom
    });
  }

  // Get real-time analytics for a user
  async getRealTimeAnalytics(userId: string, timeRange: string = '1h'): Promise<any> {
    const buffer = this.analyticsBuffer.get(userId) || [];
    const cutoffTime = this.getTimeRangeCutoff(timeRange);
    
    const recentEvents = buffer.filter(event => 
      new Date(event.timestamp) > cutoffTime
    );

    return {
      totalEvents: recentEvents.length,
      events: recentEvents,
      metrics: this.calculateMetrics(recentEvents),
      trends: this.calculateTrends(recentEvents),
      lastUpdated: new Date().toISOString()
    };
  }

  // Get live dashboard metrics
  async getLiveDashboardMetrics(userId: string): Promise<any> {
    const analytics = await this.getRealTimeAnalytics(userId, '24h');
    
    return {
      activeUsers: this.getActiveUsersCount(),
      revenueToday: this.getTodaysRevenue(userId),
      conversionRate: this.calculateConversionRate(userId),
      topProducts: this.getTopProducts(userId),
      recentActivity: analytics.events.slice(-10),
      performanceMetrics: {
        avgResponseTime: this.getAverageResponseTime(),
        successRate: this.getSuccessRate(userId),
        errorRate: this.getErrorRate(userId)
      },
      realTimeStats: {
        sessionsActive: this.getActiveSessions(),
        eventsPerMinute: this.getEventsPerMinute(),
        currentLoad: this.getCurrentSystemLoad()
      }
    };
  }

  // WebSocket connection management
  addWSConnection(userId: string, ws: WebSocket) {
    this.wsConnections.set(userId, ws);
    
    ws.on('close', () => {
      this.wsConnections.delete(userId);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error for user', userId, error);
      this.wsConnections.delete(userId);
    });

    // Send initial analytics data
    this.sendInitialData(userId, ws);
  }

  // Broadcast to specific user
  private broadcastToUser(userId: string, message: any) {
    const ws = this.wsConnections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // Broadcast to all connected clients
  broadcastToAll(message: any) {
    this.wsConnections.forEach((ws, userId) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Send initial analytics data to new connection
  private async sendInitialData(userId: string, ws: WebSocket) {
    try {
      const initialData = await this.getLiveDashboardMetrics(userId);
      ws.send(JSON.stringify({
        type: 'initial_analytics',
        payload: initialData
      }));
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  // Calculate metrics from events
  private calculateMetrics(events: any[]): any {
    const metricsByType = events.reduce((acc, event) => {
      if (!acc[event.event]) acc[event.event] = [];
      acc[event.event].push(event);
      return acc;
    }, {});

    return {
      userActions: metricsByType.user_action?.length || 0,
      productUsage: metricsByType.product_usage?.length || 0,
      funnelSteps: metricsByType.funnel_step?.length || 0,
      revenue: metricsByType.revenue?.reduce((sum, event) => sum + event.data.amount, 0) || 0,
      uniqueProducts: new Set(metricsByType.product_usage?.map(e => e.data.productId) || []).size,
      sessionDuration: this.calculateSessionDuration(events)
    };
  }

  // Calculate trends
  private calculateTrends(events: any[]): any {
    const hourlyTrends = this.groupEventsByHour(events);
    
    return {
      hourly: hourlyTrends,
      growth: this.calculateGrowthRate(hourlyTrends),
      predictions: this.generatePredictions(hourlyTrends)
    };
  }

  // Group events by hour for trending
  private groupEventsByHour(events: any[]): any {
    return events.reduce((acc, event) => {
      const hour = new Date(event.timestamp).getHours();
      if (!acc[hour]) acc[hour] = 0;
      acc[hour]++;
      return acc;
    }, {});
  }

  // Calculate growth rate
  private calculateGrowthRate(hourlyData: any): number {
    const hours = Object.keys(hourlyData).map(Number).sort();
    if (hours.length < 2) return 0;
    
    const latest = hourlyData[hours[hours.length - 1]];
    const previous = hourlyData[hours[hours.length - 2]];
    
    return previous > 0 ? ((latest - previous) / previous) * 100 : 0;
  }

  // Generate simple predictions
  private generatePredictions(hourlyData: any): any {
    const hours = Object.keys(hourlyData).map(Number).sort();
    const values = hours.map(hour => hourlyData[hour]);
    
    if (values.length < 3) return { nextHour: 0, confidence: 0 };
    
    // Simple linear regression prediction
    const avgGrowth = values.slice(-3).reduce((sum, val, idx, arr) => {
      if (idx === 0) return 0;
      return sum + (val - arr[idx - 1]);
    }, 0) / 2;
    
    return {
      nextHour: Math.max(0, values[values.length - 1] + avgGrowth),
      confidence: Math.min(95, values.length * 10)
    };
  }

  // Helper methods
  private getSessionId(userId: string): string {
    return `session_${userId}_${Date.now()}`;
  }

  private getTimeRangeCutoff(timeRange: string): Date {
    const now = new Date();
    const ranges = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    };
    
    const milliseconds = ranges[timeRange as keyof typeof ranges] || ranges['1h'];
    return new Date(now.getTime() - milliseconds);
  }

  private calculateSessionDuration(events: any[]): number {
    if (events.length < 2) return 0;
    
    const sorted = events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const start = new Date(sorted[0].timestamp);
    const end = new Date(sorted[sorted.length - 1].timestamp);
    
    return end.getTime() - start.getTime();
  }

  // Mock implementations for system metrics
  private getActiveUsersCount(): number {
    return this.wsConnections.size;
  }

  private getTodaysRevenue(userId: string): number {
    const buffer = this.analyticsBuffer.get(userId) || [];
    const today = new Date().toDateString();
    
    return buffer
      .filter(event => event.event === 'revenue' && new Date(event.timestamp).toDateString() === today)
      .reduce((sum, event) => sum + event.data.amount, 0);
  }

  private calculateConversionRate(userId: string): number {
    const buffer = this.analyticsBuffer.get(userId) || [];
    const funnelSteps = buffer.filter(event => event.event === 'funnel_step');
    const conversions = buffer.filter(event => event.event === 'revenue');
    
    return funnelSteps.length > 0 ? (conversions.length / funnelSteps.length) * 100 : 0;
  }

  private getTopProducts(userId: string): any[] {
    const buffer = this.analyticsBuffer.get(userId) || [];
    const productUsage = buffer.filter(event => event.event === 'product_usage');
    
    const productCounts = productUsage.reduce((acc, event) => {
      const productId = event.data.productId;
      acc[productId] = (acc[productId] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(productCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([productId, count]) => ({ productId, usage: count }));
  }

  private getAverageResponseTime(): number {
    return Math.random() * 100 + 50; // Mock implementation
  }

  private getSuccessRate(userId: string): number {
    const buffer = this.analyticsBuffer.get(userId) || [];
    const productUsage = buffer.filter(event => event.event === 'product_usage');
    
    if (productUsage.length === 0) return 100;
    
    const successfulUsage = productUsage.filter(event => event.data.usage?.success !== false);
    return (successfulUsage.length / productUsage.length) * 100;
  }

  private getErrorRate(userId: string): number {
    return 100 - this.getSuccessRate(userId);
  }

  private getActiveSessions(): number {
    return Math.floor(Math.random() * 50) + 10; // Mock implementation
  }

  private getEventsPerMinute(): number {
    const allEvents = Array.from(this.analyticsBuffer.values()).flat();
    const lastMinute = new Date(Date.now() - 60000);
    
    return allEvents.filter(event => new Date(event.timestamp) > lastMinute).length;
  }

  private getCurrentSystemLoad(): number {
    return Math.random() * 100; // Mock implementation
  }

  // Flush analytics buffer periodically
  private startFlushTimer() {
    this.flushInterval = setInterval(() => {
      this.flushAnalyticsBuffer();
    }, 60000); // Flush every minute
  }

  private flushAnalyticsBuffer() {
    // In production, flush to database or external analytics service
    for (const [userId, events] of this.analyticsBuffer.entries()) {
      if (events.length > 100) {
        // Keep only recent events in memory
        this.analyticsBuffer.set(userId, events.slice(-50));
      }
    }
  }

  // WebSocket connection management
  addWSConnection(userId: string, ws: any) {
    if (!this.wsConnections.has(userId)) {
      this.wsConnections.set(userId, new Set());
    }
    this.wsConnections.get(userId)!.add(ws);
    
    // Send initial analytics data
    const analytics = this.getRealTimeAnalytics(userId);
    ws.send(JSON.stringify({
      type: 'initial_analytics',
      data: analytics
    }));
  }

  removeWSConnection(userId: string, ws: any) {
    const userConnections = this.wsConnections.get(userId);
    if (userConnections) {
      userConnections.delete(ws);
      if (userConnections.size === 0) {
        this.wsConnections.delete(userId);
      }
    }
  }

  // Broadcast to specific user
  broadcastToUser(userId: string, data: any) {
    const userConnections = this.wsConnections.get(userId);
    if (userConnections) {
      userConnections.forEach(ws => {
        try {
          ws.send(JSON.stringify({
            type: 'analytics_update',
            data
          }));
        } catch (error) {
          // Remove failed connection
          this.removeWSConnection(userId, ws);
        }
      });
    }
  }

  // Broadcast to all connected users
  broadcastToAll(data: any) {
    for (const [userId, connections] of this.wsConnections.entries()) {
      connections.forEach(ws => {
        try {
          ws.send(JSON.stringify(data));
        } catch (error) {
          // Remove failed connection
          this.removeWSConnection(userId, ws);
        }
      });
    }
  }

  // Cleanup
  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.wsConnections.clear();
    this.analyticsBuffer.clear();
  }
}

// Singleton instance
export const realTimeAnalytics = new RealTimeAnalytics();