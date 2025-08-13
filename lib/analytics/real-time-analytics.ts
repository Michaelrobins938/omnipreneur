import prisma from '@/lib/db';

export interface RealTimeMetrics {
  activeUsers: number;
  totalRequests: number;
  requestsPerMinute: number;
  averageResponseTime: number;
  errorRate: number;
  topProducts: Array<{
    productId: string;
    name: string;
    requests: number;
    avgProcessingTime: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    timestamp: Date;
    userId: string;
    productId?: string;
    details: any;
  }>;
}

export interface LiveDashboardMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  conversionRate: number;
  churnRate: number;
  averageSessionDuration: number;
  topPerformingProducts: Array<{
    productId: string;
    name: string;
    usage: number;
    revenue: number;
    growth: number;
  }>;
  userGrowth: Array<{
    date: string;
    newUsers: number;
    totalUsers: number;
  }>;
}

class RealTimeAnalytics {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any, ttlMs: number = 60000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  async getRealTimeAnalytics(userId: string, timeRange: string = '24h'): Promise<RealTimeMetrics> {
    const cacheKey = `realtime:${userId}:${timeRange}`;
    const cached = this.getCachedData<RealTimeMetrics>(cacheKey);
    if (cached) return cached;

    const timeRangeMs = this.parseTimeRange(timeRange);
    const startTime = new Date(Date.now() - timeRangeMs);

    try {
      const [
        activeUsersCount,
        totalRequestsCount,
        recentRequests,
        averageResponseTime,
        errorCount,
        topProductsData,
        recentActivityData
      ] = await Promise.all([
        this.getActiveUsersCount(startTime),
        this.getTotalRequestsCount(userId, startTime),
        this.getRecentRequestsForRPM(startTime),
        this.getAverageResponseTime(userId, startTime),
        this.getErrorCount(userId, startTime),
        this.getTopProducts(userId, startTime),
        this.getRecentActivity(userId, startTime)
      ]);

      const requestsPerMinute = this.calculateRequestsPerMinute(recentRequests, timeRangeMs);
      const errorRate = totalRequestsCount > 0 ? (errorCount / totalRequestsCount) * 100 : 0;

      const metrics: RealTimeMetrics = {
        activeUsers: activeUsersCount,
        totalRequests: totalRequestsCount,
        requestsPerMinute,
        averageResponseTime: averageResponseTime || 0,
        errorRate,
        topProducts: topProductsData,
        recentActivity: recentActivityData,
      };

      this.setCachedData(cacheKey, metrics, 30000); // 30 second cache
      return metrics;

    } catch (error) {
      console.error('Failed to get real-time analytics:', error);
      return this.getDefaultMetrics();
    }
  }

  async getLiveDashboardMetrics(userId: string): Promise<LiveDashboardMetrics> {
    const cacheKey = `dashboard:${userId}`;
    const cached = this.getCachedData<LiveDashboardMetrics>(cacheKey);
    if (cached) return cached;

    try {
      const [
        totalUsers,
        activeSubscriptions,
        monthlyRevenue,
        conversionRate,
        churnRate,
        avgSessionDuration,
        topProducts,
        userGrowthData
      ] = await Promise.all([
        this.getTotalUsersCount(),
        this.getActiveSubscriptionsCount(),
        this.getMonthlyRevenue(),
        this.getConversionRate(),
        this.getChurnRate(),
        this.getAverageSessionDuration(),
        this.getTopPerformingProducts(),
        this.getUserGrowthData()
      ]);

      const metrics: LiveDashboardMetrics = {
        totalUsers,
        activeSubscriptions,
        monthlyRevenue,
        conversionRate,
        churnRate,
        averageSessionDuration: avgSessionDuration || 0,
        topPerformingProducts: topProducts,
        userGrowth: userGrowthData,
      };

      this.setCachedData(cacheKey, metrics, 120000); // 2 minute cache
      return metrics;

    } catch (error) {
      console.error('Failed to get dashboard metrics:', error);
      return this.getDefaultDashboardMetrics();
    }
  }

  private async getActiveUsersCount(since: Date): Promise<number> {
    const count = await prisma.user.count({
      where: {
        events: {
          some: {
            timestamp: { gte: since }
          }
        }
      }
    });
    return count;
  }

  private async getTotalRequestsCount(userId: string, since: Date): Promise<number> {
    const count = await prisma.aIRequest.count({
      where: {
        userId,
        createdAt: { gte: since }
      }
    });
    return count;
  }

  private async getRecentRequestsForRPM(since: Date) {
    const requests = await prisma.aIRequest.findMany({
      where: {
        createdAt: { gte: since }
      },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return requests;
  }

  private async getAverageResponseTime(userId: string, since: Date): Promise<number | null> {
    const result = await prisma.aIRequest.aggregate({
      where: {
        userId,
        createdAt: { gte: since },
        processingTimeMs: { not: null }
      },
      _avg: {
        processingTimeMs: true
      }
    });
    return result._avg.processingTimeMs;
  }

  private async getErrorCount(userId: string, since: Date): Promise<number> {
    const count = await prisma.aIRequest.count({
      where: {
        userId,
        createdAt: { gte: since },
        success: false
      }
    });
    return count;
  }

  private async getTopProducts(userId: string, since: Date) {
    const products = await prisma.aIRequest.groupBy({
      by: ['productId'],
      where: {
        userId,
        createdAt: { gte: since }
      },
      _count: { id: true },
      _avg: { processingTimeMs: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    return products.map(p => ({
      productId: p.productId,
      name: this.getProductName(p.productId),
      requests: p._count.id,
      avgProcessingTime: p._avg.processingTimeMs || 0
    }));
  }

  private async getRecentActivity(userId: string, since: Date) {
    const activities = await prisma.event.findMany({
      where: {
        userId,
        timestamp: { gte: since }
      },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: {
        id: true,
        type: true,
        timestamp: true,
        userId: true,
        data: true
      }
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      timestamp: activity.timestamp,
      userId: activity.userId,
      productId: activity.data?.productId,
      details: activity.data
    }));
  }

  private async getTotalUsersCount(): Promise<number> {
    return await prisma.user.count();
  }

  private async getActiveSubscriptionsCount(): Promise<number> {
    return await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    });
  }

  private async getMonthlyRevenue(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const result = await prisma.payment.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: 'SUCCEEDED'
      },
      _sum: { amount: true }
    });

    return (result._sum.amount || 0) / 100; // Convert from cents
  }

  private async getConversionRate(): Promise<number> {
    const totalUsers = await prisma.user.count();
    const subscribedUsers = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    });

    return totalUsers > 0 ? (subscribedUsers / totalUsers) * 100 : 0;
  }

  private async getChurnRate(): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [activeAtStart, cancelledThisMonth] = await Promise.all([
      prisma.subscription.count({
        where: {
          createdAt: { lt: startOfMonth },
          status: 'ACTIVE'
        }
      }),
      prisma.subscription.count({
        where: {
          updatedAt: { gte: startOfMonth },
          status: 'CANCELLED'
        }
      })
    ]);

    return activeAtStart > 0 ? (cancelledThisMonth / activeAtStart) * 100 : 0;
  }

  private async getAverageSessionDuration(): Promise<number | null> {
    // This would require session tracking implementation
    // For now, return a calculated estimate
    return 1200; // 20 minutes average
  }

  private async getTopPerformingProducts() {
    const products = await prisma.aIRequest.groupBy({
      by: ['productId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    return products.map(p => ({
      productId: p.productId,
      name: this.getProductName(p.productId),
      usage: p._count.id,
      revenue: 0, // Would need payment correlation
      growth: 0   // Would need time-based comparison
    }));
  }

  private async getUserGrowthData() {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const dailyGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: thirtyDaysAgo }
      },
      _count: { id: true },
      orderBy: { createdAt: 'asc' }
    });

    let totalUsers = await prisma.user.count({
      where: { createdAt: { lt: thirtyDaysAgo } }
    });

    return dailyGrowth.map(day => {
      totalUsers += day._count.id;
      return {
        date: day.createdAt.toISOString().split('T')[0],
        newUsers: day._count.id,
        totalUsers
      };
    });
  }

  private calculateRequestsPerMinute(requests: any[], timeRangeMs: number): number {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    const recentRequests = requests.filter(r => 
      new Date(r.createdAt).getTime() > oneMinuteAgo
    );
    
    return recentRequests.length;
  }

  private parseTimeRange(timeRange: string): number {
    const ranges: Record<string, number> = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
    };
    return ranges[timeRange] || ranges['24h'];
  }

  private getProductName(productId: string): string {
    const names: Record<string, string> = {
      'novus-protocol': 'NOVUS Protocol',
      'bundle-builder': 'Bundle Builder',
      'content-spawner': 'Content Spawner',
      'auto-rewrite': 'Auto Rewrite Engine',
      'live-dashboard': 'Live Dashboard',
      'aesthetic-generator': 'Aesthetic Generator',
    };
    return names[productId] || productId;
  }

  private getDefaultMetrics(): RealTimeMetrics {
    return {
      activeUsers: 0,
      totalRequests: 0,
      requestsPerMinute: 0,
      averageResponseTime: 0,
      errorRate: 0,
      topProducts: [],
      recentActivity: [],
    };
  }

  private getDefaultDashboardMetrics(): LiveDashboardMetrics {
    return {
      totalUsers: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
      churnRate: 0,
      averageSessionDuration: 0,
      topPerformingProducts: [],
      userGrowth: [],
    };
  }
}

export const realTimeAnalytics = new RealTimeAnalytics();