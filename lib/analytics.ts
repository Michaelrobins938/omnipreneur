import prisma from './db';

export interface AnalyticsEvent {
  userId: string;
  event: string;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  churnRate: number;
  averageSessionDuration: number;
  conversionRate: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  refundRate: number;
}

export interface FeatureMetrics {
  rewritesGenerated: number;
  contentPiecesCreated: number;
  bundlesBuilt: number;
  affiliateLinksCreated: number;
  mostPopularFeatures: string[];
}

// Track user events
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  // Analytics tracking - logging removed for production
  // TODO: Implement actual analytics tracking
}

// Track page views
export async function trackPageView(userId: string, page: string, referrer?: string) {
  await trackEvent({
    userId,
    event: 'page_view',
    metadata: {
      page,
      referrer,
      userAgent: 'tracked_ua' // In production, extract from request
    }
  });
}

// Track feature usage
export async function trackFeatureUsage(userId: string, feature: string, metadata?: Record<string, any>) {
  await trackEvent({
    userId,
    event: 'feature_used',
    metadata: {
      feature,
      ...metadata
    }
  });
}

// Track conversions
export async function trackConversion(userId: string, conversionType: string, value?: number) {
  await trackEvent({
    userId,
    event: 'conversion',
    metadata: {
      type: conversionType,
      value
    }
  });
}

// Track errors
export async function trackError(userId: string, error: string, context?: Record<string, any>) {
  await trackEvent({
    userId,
    event: 'error',
    metadata: {
      error,
      context
    }
  });
}

// Get user metrics
export async function getUserMetrics(): Promise<UserMetrics> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsers,
      activeUsers,
      churnedUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      }),
      prisma.event.groupBy({
        by: ['userId'],
        where: {
          timestamp: {
            gte: thirtyDaysAgo
          }
        },
        _count: {
          userId: true
        }
      }),
      prisma.user.count({
        where: {
          subscription: {
            status: 'CANCELLED'
          },
          updatedAt: {
            gte: thirtyDaysAgo
          }
        }
      })
    ]);

    const activeUserCount = activeUsers.length;
    const churnRate = totalUsers > 0 ? (churnedUsers / totalUsers) * 100 : 0;

    return {
      totalUsers,
      activeUsers: activeUserCount,
      newUsers,
      churnRate,
      averageSessionDuration: 0, // Would need session tracking
      conversionRate: 0 // Would need conversion tracking
    };
  } catch (error) {
    console.error('Error getting user metrics:', error);
    return {
      totalUsers: 0,
      activeUsers: 0,
      newUsers: 0,
      churnRate: 0,
      averageSessionDuration: 0,
      conversionRate: 0
    };
  }
}

// Get revenue metrics
export async function getRevenueMetrics(): Promise<RevenueMetrics> {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalRevenue,
      monthlyRevenue,
      payments,
      refunds
    ] = await Promise.all([
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED'
        },
        _sum: {
          amount: true
        }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCEEDED',
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        _sum: {
          amount: true
        }
      }),
      prisma.payment.count({
        where: {
          status: 'SUCCEEDED'
        }
      }),
      prisma.payment.count({
        where: {
          status: 'FAILED'
        }
      })
    ]);

    const totalRev = totalRevenue._sum.amount || 0;
    const monthlyRev = monthlyRevenue._sum.amount || 0;
    const totalPayments = payments;
    const totalRefunds = refunds;

    return {
      totalRevenue: totalRev,
      monthlyRecurringRevenue: monthlyRev,
      averageOrderValue: totalPayments > 0 ? totalRev / totalPayments : 0,
      customerLifetimeValue: 0, // Would need more complex calculation
      refundRate: totalPayments > 0 ? (totalRefunds / totalPayments) * 100 : 0
    };
  } catch (error) {
    console.error('Error getting revenue metrics:', error);
    return {
      totalRevenue: 0,
      monthlyRecurringRevenue: 0,
      averageOrderValue: 0,
      customerLifetimeValue: 0,
      refundRate: 0
    };
  }
}

// Get feature usage metrics
export async function getFeatureMetrics(): Promise<FeatureMetrics> {
  try {
    const [
      rewrites,
      contentPieces,
      bundles,
      affiliateLinks,
      featureEvents
    ] = await Promise.all([
      prisma.rewrite.count(),
      prisma.contentPiece.count(),
      prisma.bundle.count(),
      prisma.affiliateLink.count(),
      prisma.event.groupBy({
        by: ['event'],
        where: {
          event: {
            startsWith: 'feature_used'
          }
        },
        _count: {
          event: true
        },
        orderBy: {
          _count: {
            event: 'desc'
          }
        }
      })
    ]);

    const mostPopularFeatures = featureEvents
      .slice(0, 5)
      .map((event: { event: string }) => event.event.replace('feature_used_', ''));

    return {
      rewritesGenerated: rewrites,
      contentPiecesCreated: contentPieces,
      bundlesBuilt: bundles,
      affiliateLinksCreated: affiliateLinks,
      mostPopularFeatures
    };
  } catch (error) {
    console.error('Error getting feature metrics:', error);
    return {
      rewritesGenerated: 0,
      contentPiecesCreated: 0,
      bundlesBuilt: 0,
      affiliateLinksCreated: 0,
      mostPopularFeatures: []
    };
  }
}

// Get user activity timeline
export async function getUserActivity(userId: string, days: number = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await prisma.event.findMany({
      where: {
        userId,
        timestamp: {
          gte: startDate
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return events;
  } catch (error) {
    console.error('Error getting user activity:', error);
    return [];
  }
}

// Get conversion funnel
export async function getConversionFunnel() {
  try {
    const [
      pageViews,
      signups,
      trials,
      paidConversions
    ] = await Promise.all([
      prisma.event.count({
        where: {
          event: 'page_view'
        }
      }),
      prisma.event.count({
        where: {
          event: 'user_registered'
        }
      }),
      prisma.event.count({
        where: {
          event: 'trial_started'
        }
      }),
      prisma.event.count({
        where: {
          event: 'conversion',
          metadata: {
            path: ['type'],
            equals: 'paid'
          }
        }
      })
    ]);

    return {
      pageViews,
      signups,
      trials,
      paidConversions,
      signupRate: pageViews > 0 ? (signups / pageViews) * 100 : 0,
      trialRate: signups > 0 ? (trials / signups) * 100 : 0,
      conversionRate: trials > 0 ? (paidConversions / trials) * 100 : 0
    };
  } catch (error) {
    console.error('Error getting conversion funnel:', error);
    return {
      pageViews: 0,
      signups: 0,
      trials: 0,
      paidConversions: 0,
      signupRate: 0,
      trialRate: 0,
      conversionRate: 0
    };
  }
}

// Export analytics data
export async function exportAnalyticsData(startDate: Date, endDate: Date) {
  try {
    const events = await prisma.event.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    return events;
  } catch (error) {
    console.error('Error exporting analytics data:', error);
    return [];
  }
} 