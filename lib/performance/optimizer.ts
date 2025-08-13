// @ts-nocheck
/**
 * Performance Optimization Utilities
 * 
 * This module provides tools for optimizing database queries,
 * caching strategies, and AI service performance.
 */

import prisma from '@/lib/db';
import { Redis } from 'ioredis';

class PerformanceOptimizer {
  private redis: Redis | null = null;

  constructor() {
    // Initialize Redis if available
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL);
        console.log('✅ Redis connected for caching');
      } catch (error) {
        console.warn('⚠️ Redis connection failed, using memory cache fallback');
      }
    }
  }

  // Database Query Optimizations
  async getOptimizedAnalytics(userId: string, timeRange = '30d'): Promise<any> {
    const cacheKey = `analytics:${userId}:${timeRange}`;
    
    // Try cache first
    if (this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (error) {
        console.warn('Cache read failed:', error);
      }
    }

    const days = parseInt(timeRange.replace('d', ''));
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Optimized parallel queries
    const [
      userStats,
      aiRequestStats,
      contentStats,
      revenueStats,
      usageStats
    ] = await Promise.all([
      // User statistics
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          createdAt: true,
          ai_credits_remaining: true,
          subscription: {
            select: { plan: true, status: true }
          }
        }
      }),

      // AI request statistics (optimized with aggregation)
      prisma.aIRequest.aggregate({
        where: {
          userId,
          timestamp: { gte: startDate }
        },
        _count: { id: true },
        _avg: { processingTimeMs: true },
        _sum: { 
          processingTimeMs: true
        }
      }),

      // Content statistics (batch query)
      prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN table_name = 'ContentPiece' THEN 1 END) as contentPieces,
          COUNT(CASE WHEN table_name = 'Rewrite' THEN 1 END) as rewrites,
          COUNT(CASE WHEN table_name = 'Bundle' THEN 1 END) as bundles,
          COUNT(CASE WHEN table_name = 'AffiliateLink' THEN 1 END) as affiliateLinks
        FROM (
          SELECT 'ContentPiece' as table_name FROM "ContentPiece" WHERE "userId" = ${userId} AND "createdAt" >= ${startDate}
          UNION ALL
          SELECT 'Rewrite' as table_name FROM "Rewrite" WHERE "userId" = ${userId} AND "createdAt" >= ${startDate}
          UNION ALL
          SELECT 'Bundle' as table_name FROM "Bundle" WHERE "userId" = ${userId} AND "createdAt" >= ${startDate}
          UNION ALL
          SELECT 'AffiliateLink' as table_name FROM "AffiliateLink" WHERE "userId" = ${userId} AND "createdAt" >= ${startDate}
        ) as combined
      `,

      // Revenue statistics
      prisma.payment.aggregate({
        where: {
          userId,
          status: 'SUCCEEDED',
          createdAt: { gte: startDate }
        },
        _sum: { amount: true },
        _count: { id: true }
      }),

      // Usage statistics
      prisma.usage.findUnique({
        where: { userId },
        select: {
          aiRequestsUsed: true,
          rewrites: true,
          contentPieces: true,
          bundles: true,
          affiliateLinks: true
        }
      })
    ]);

    const result = {
      user: userStats,
      aiRequests: {
        total: aiRequestStats._count.id || 0,
        avgProcessingTime: aiRequestStats._avg.processingTimeMs || 0,
        totalProcessingTime: aiRequestStats._sum.processingTimeMs || 0
      },
      content: contentStats[0] || {
        contentPieces: 0,
        rewrites: 0,
        bundles: 0,
        affiliateLinks: 0
      },
      revenue: {
        total: revenueStats._sum.amount || 0,
        transactions: revenueStats._count.id || 0
      },
      usage: usageStats || {
        aiRequestsUsed: 0,
        rewrites: 0,
        contentPieces: 0,
        bundles: 0,
        affiliateLinks: 0
      },
      generatedAt: new Date().toISOString()
    };

    // Cache the result
    if (this.redis) {
      try {
        await this.redis.setex(cacheKey, 300, JSON.stringify(result)); // Cache for 5 minutes
      } catch (error) {
        console.warn('Cache write failed:', error);
      }
    }

    return result;
  }

  // Optimized admin analytics
  async getOptimizedAdminAnalytics(period = '30d'): Promise<any> {
    const cacheKey = `admin-analytics:${period}`;
    
    // Try cache first
    if (this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (error) {
        console.warn('Cache read failed:', error);
      }
    }

    const days = parseInt(period.replace('d', ''));
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Use raw SQL for better performance on large datasets
    const [
      userMetrics,
      aiMetrics,
      revenueMetrics,
      subscriptionMetrics,
      contentMetrics
    ] = await Promise.all([
      // User metrics
      prisma.$queryRaw`
        SELECT 
          COUNT(*) as "totalUsers",
          COUNT(CASE WHEN "createdAt" >= ${startDate} THEN 1 END) as "newUsers",
          COUNT(CASE WHEN EXISTS(
            SELECT 1 FROM "Event" e WHERE e."userId" = "User".id AND e.timestamp >= ${new Date(Date.now() - 24 * 60 * 60 * 1000)}
          ) THEN 1 END) as "activeUsers"
        FROM "User"
      `,

      // AI metrics
      prisma.$queryRaw`
        SELECT 
          COUNT(*) as "totalRequests",
          AVG("processingTimeMs") as "avgProcessingTime",
          SUM("processingTimeMs") as "totalProcessingTime",
          COUNT(DISTINCT "userId") as "uniqueUsers"
        FROM "AIRequest"
        WHERE timestamp >= ${startDate}
      `,

      // Revenue metrics
      prisma.$queryRaw`
        SELECT 
          COALESCE(SUM(amount), 0) as "totalRevenue",
          COUNT(*) as "totalTransactions",
          AVG(amount) as "avgTransactionValue"
        FROM "Payment"
        WHERE status = 'SUCCEEDED' AND "createdAt" >= ${startDate}
      `,

      // Subscription distribution
      prisma.$queryRaw`
        SELECT 
          COALESCE(plan, 'FREE') as plan,
          COUNT(*) as count
        FROM "User" u
        LEFT JOIN "Subscription" s ON u.id = s."userId" AND s.status = 'ACTIVE'
        GROUP BY COALESCE(plan, 'FREE')
      `,

      // Content metrics by type
      prisma.$queryRaw`
        SELECT 
          'contentPieces' as type, COUNT(*) as count FROM "ContentPiece" WHERE "createdAt" >= ${startDate}
        UNION ALL
        SELECT 'rewrites' as type, COUNT(*) as count FROM "Rewrite" WHERE "createdAt" >= ${startDate}
        UNION ALL
        SELECT 'bundles' as type, COUNT(*) as count FROM "Bundle" WHERE "createdAt" >= ${startDate}
        UNION ALL
        SELECT 'affiliateLinks' as type, COUNT(*) as count FROM "AffiliateLink" WHERE "createdAt" >= ${startDate}
      `
    ]);

    const result = {
      period,
      overview: {
        totalUsers: Number(userMetrics[0].totalUsers),
        newUsers: Number(userMetrics[0].newUsers),
        activeUsers: Number(userMetrics[0].activeUsers),
        activeUserRate: userMetrics[0].totalUsers > 0 
          ? ((Number(userMetrics[0].activeUsers) / Number(userMetrics[0].totalUsers)) * 100).toFixed(1) + '%'
          : '0%',
        totalRevenue: Number(revenueMetrics[0].totalRevenue),
        totalTransactions: Number(revenueMetrics[0].totalTransactions),
        avgTransactionValue: Number(revenueMetrics[0].avgTransactionValue) || 0
      },
      aiUsage: {
        totalRequests: Number(aiMetrics[0].totalRequests),
        avgProcessingTime: Number(aiMetrics[0].avgProcessingTime).toFixed(0) + 'ms',
        totalProcessingTime: Number(aiMetrics[0].totalProcessingTime),
        uniqueUsers: Number(aiMetrics[0].uniqueUsers)
      },
      subscriptions: {
        distribution: subscriptionMetrics.reduce((acc: any, sub: any) => {
          acc[sub.plan] = Number(sub.count);
          return acc;
        }, {})
      },
      content: {
        byType: contentMetrics.reduce((acc: any, content: any) => {
          acc[content.type] = Number(content.count);
          return acc;
        }, {})
      },
      generatedAt: new Date().toISOString()
    };

    // Cache for 10 minutes
    if (this.redis) {
      try {
        await this.redis.setex(cacheKey, 600, JSON.stringify(result));
      } catch (error) {
        console.warn('Cache write failed:', error);
      }
    }

    return result;
  }

  // AI Service Performance Optimization
  async optimizeAIServiceCall(
    serviceCall: () => Promise<any>,
    cacheKey?: string,
    cacheDuration = 3600
  ): Promise<any> {
    // Try cache first if key provided
    if (cacheKey && this.redis) {
      try {
        const cached = await this.redis.get(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      } catch (error) {
        console.warn('AI cache read failed:', error);
      }
    }

    const startTime = Date.now();
    
    try {
      const result = await serviceCall();
      const processingTime = Date.now() - startTime;

      // Cache successful results
      if (result && cacheKey && this.redis) {
        try {
          await this.redis.setex(cacheKey, cacheDuration, JSON.stringify(result));
        } catch (error) {
          console.warn('AI cache write failed:', error);
        }
      }

      // Log performance metrics
      if (processingTime > 5000) {
        console.warn(`Slow AI service call: ${processingTime}ms`);
      }

      return result;
    } catch (error) {
      console.error(`AI service call failed after ${Date.now() - startTime}ms:`, error);
      throw error;
    }
  }

  // Database connection pooling optimization
  async optimizeDatabaseConnections(): Promise<{
    activeConnections: number;
    recommendations: string[];
  }> {
    try {
      // Check current connections (PostgreSQL specific)
      const connectionInfo = await prisma.$queryRaw`
        SELECT 
          COUNT(*) as active_connections,
          MAX(pg_stat_activity.state) as max_state
        FROM pg_stat_activity 
        WHERE pg_stat_activity.datname = current_database()
      `;

      const activeConnections = Number(connectionInfo[0].active_connections);
      const recommendations: string[] = [];

      if (activeConnections > 20) {
        recommendations.push('Consider implementing connection pooling');
      }

      if (activeConnections > 50) {
        recommendations.push('High connection count detected - investigate potential connection leaks');
      }

      // Check for long-running queries
      const longQueries = await prisma.$queryRaw`
        SELECT COUNT(*) as long_query_count
        FROM pg_stat_activity 
        WHERE pg_stat_activity.datname = current_database()
        AND state = 'active'
        AND query_start < NOW() - INTERVAL '5 seconds'
      `;

      if (Number(longQueries[0].long_query_count) > 0) {
        recommendations.push('Long-running queries detected - consider optimization');
      }

      return {
        activeConnections,
        recommendations
      };

    } catch (error) {
      console.error('Database optimization check failed:', error);
      return {
        activeConnections: -1,
        recommendations: ['Unable to check database performance']
      };
    }
  }

  // Memory cache for frequently accessed data
  private memoryCache: Map<string, { data: any; expiry: number }> = new Map();

  async getFromCache(key: string): Promise<any> {
    // Check memory cache first
    const memCached = this.memoryCache.get(key);
    if (memCached && memCached.expiry > Date.now()) {
      return memCached.data;
    }

    // Check Redis cache
    if (this.redis) {
      try {
        const cached = await this.redis.get(key);
        if (cached) {
          const data = JSON.parse(cached);
          // Store in memory cache for faster access
          this.memoryCache.set(key, {
            data,
            expiry: Date.now() + 60000 // 1 minute memory cache
          });
          return data;
        }
      } catch (error) {
        console.warn('Redis cache read failed:', error);
      }
    }

    return null;
  }

  async setCache(key: string, data: any, ttl = 3600): Promise<void> {
    // Set in memory cache
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + Math.min(ttl * 1000, 300000) // Max 5 minutes in memory
    });

    // Set in Redis cache
    if (this.redis) {
      try {
        await this.redis.setex(key, ttl, JSON.stringify(data));
      } catch (error) {
        console.warn('Redis cache write failed:', error);
      }
    }
  }

  // Cleanup memory cache periodically
  private startCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of this.memoryCache.entries()) {
        if (value.expiry <= now) {
          this.memoryCache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }

  // Get performance metrics
  async getPerformanceMetrics(): Promise<{
    database: any;
    cache: any;
    memory: any;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];
    
    // Database metrics
    const dbMetrics = await this.optimizeDatabaseConnections();
    recommendations.push(...dbMetrics.recommendations);

    // Cache metrics
    const cacheMetrics = {
      memoryCache: {
        size: this.memoryCache.size,
        maxSize: 1000 // Arbitrary limit
      },
      redis: {
        connected: !!this.redis,
        status: this.redis ? 'connected' : 'disconnected'
      }
    };

    if (this.memoryCache.size > 500) {
      recommendations.push('Memory cache growing large - consider optimization');
    }

    // System memory metrics
    const memoryMetrics = process.memoryUsage();
    
    if (memoryMetrics.heapUsed / memoryMetrics.heapTotal > 0.8) {
      recommendations.push('High memory usage detected - consider optimization');
    }

    return {
      database: dbMetrics,
      cache: cacheMetrics,
      memory: memoryMetrics,
      recommendations
    };
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer();
export default PerformanceOptimizer;