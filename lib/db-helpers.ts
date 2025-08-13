// @ts-nocheck
/**
 * Database Helper Functions for Common Operations
 * Simplifies database operations and ensures consistency
 */

import prisma from './db';
import { Prisma } from '@prisma/client';

/**
 * User Management Helpers
 */
export const userHelpers = {
  /**
   * Get user with full profile including subscription and usage
   */
  async getFullProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        usage: true,
        _count: {
          select: {
            contentPieces: true,
            bundles: true,
            affiliateLinks: true,
            rewrites: true
          }
        }
      }
    });
  },

  /**
   * Update user usage counters
   */
  async incrementUsage(userId: string, type: 'contentPieces' | 'bundles' | 'affiliateLinks' | 'rewrites', amount = 1) {
    return await prisma.usage.upsert({
      where: { userId },
      update: {
        [type]: { increment: amount }
      },
      create: {
        userId,
        [type]: amount,
        contentPieces: type === 'contentPieces' ? amount : 0,
        bundles: type === 'bundles' ? amount : 0,
        affiliateLinks: type === 'affiliateLinks' ? amount : 0,
        rewrites: type === 'rewrites' ? amount : 0
      }
    });
  },

  /**
   * Check if user has reached usage limit
   */
  async checkUsageLimit(userId: string, type: 'contentPieces' | 'bundles' | 'affiliateLinks' | 'rewrites', limit: number) {
    const usage = await prisma.usage.findUnique({
      where: { userId }
    });
    
    if (!usage) return false;
return (usage as any)[type] >= limit;
  },

  /**
   * Get user's subscription plan with limits
   */
  async getSubscriptionLimits(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });
    
    if (!user?.subscription) {
      return {
        plan: $Enums.Plan.FREE,
        limits: {
          contentPieces: 10,
          bundles: 2,
          affiliateLinks: 5,
          rewrites: 20
        }
      };
    }
    
    const planLimits = {
      FREE: {
        contentPieces: 10,
        bundles: 2,
        affiliateLinks: 5,
        rewrites: 20
      },
      PRO: {
        contentPieces: 500,
        bundles: 50,
        affiliateLinks: 100,
        rewrites: 1000
      },
      ENTERPRISE: {
        contentPieces: -1, // Unlimited
        bundles: -1,
        affiliateLinks: -1,
        rewrites: -1
      }
    };
    
    return {
      plan: user.subscription.plan,
      limits: planLimits[user.subscription.plan as keyof typeof planLimits] || planLimits.FREE
    };
  }
};

/**
 * Content Management Helpers
 */
export const contentHelpers = {
  /**
   * Create content piece with automatic usage tracking
   */
  async createContentPiece(userId: string, data: {
    content: string;
    contentType: string;
    niche: string;
    keywords: string[];
    tone?: string;
    targetAudience?: string;
  }) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create content piece
      const contentPiece = await tx.contentPiece.create({
        data: {
          userId,
          content: data.content,
          niche: data.niche,
          keywords: data.keywords,
          tone: data.tone || '',
          targetAudience: data.targetAudience || null,
          contentType: data.contentType as 'SOCIAL' | 'BLOG' | 'EMAIL' | 'VIDEO' | 'MIXED'
        }
      });
      
      // Update usage counter
      await tx.usage.upsert({
        where: { userId },
        update: { contentPieces: { increment: 1 } },
        create: {
          userId,
          contentPieces: 1,
          bundles: 0,
          affiliateLinks: 0,
          rewrites: 0
        }
      });
      
      return contentPiece;
    });
  },

  /**
   * Get user's content pieces with pagination
   */
  async getUserContent(userId: string, options: {
    page?: number;
    limit?: number;
    contentType?: string;
    niche?: string;
  } = {}) {
    const { page = 1, limit = 20, contentType, niche } = options;
    const skip = (page - 1) * limit;
    
    const where: Prisma.ContentPieceWhereInput = {
      userId,
  ...(contentType && { contentType: contentType as 'SOCIAL' | 'BLOG' | 'EMAIL' | 'VIDEO' | 'MIXED' }),
      ...(niche && { niche: { contains: niche, mode: 'insensitive' } })
    };
    
    const [content, total] = await Promise.all([
      prisma.contentPiece.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          contentType: true,
          niche: true,
          keywords: true,
          createdAt: true
        }
      }),
      prisma.contentPiece.count({ where })
    ]);
    
    return {
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
};

/**
 * Bundle Management Helpers
 */
export const bundleHelpers = {
  /**
   * Create bundle with automatic usage tracking
   */
  async createBundle(userId: string, data: {
    name: string;
    description: string;
    products: any[];
    price: number;
    bundleType: string;
    targetAudience: string;
    category?: string;
    tags?: string[];
  }) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create bundle
      const bundle = await tx.bundle.create({
        data: {
          userId,
          ...data,
  bundleType: data.bundleType as 'COURSE' | 'TEMPLATE' | 'TOOLKIT' | 'MASTERCLASS' | 'SOFTWARE',
          bundleData: {}
        }
      });
      
      // Update usage counter
      await tx.usage.upsert({
        where: { userId },
        update: { bundles: { increment: 1 } },
        create: {
          userId,
          contentPieces: 0,
          bundles: 1,
          affiliateLinks: 0,
          rewrites: 0
        }
      });
      
      return bundle;
    });
  },

  /**
   * Get user's bundles with sales data
   */
  async getUserBundles(userId: string) {
    return await prisma.bundle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {

      }
    });
  }
};

/**
 * Affiliate Link Helpers
 */
export const affiliateHelpers = {
  /**
   * Create affiliate link with automatic usage tracking
   */
  async createAffiliateLink(userId: string, data: {
    originalUrl: string;
    productName: string;
    commission: number;
    description?: string;
  }) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Generate unique affiliate code
      const linkId = `${userId.slice(-6)}_${Date.now().toString(36)}`;
      
      // Create affiliate link
      const affiliateLink = await tx.affiliateLink.create({
        data: {
          userId,
          linkId,
          originalUrl: data.originalUrl,
          affiliateUrl: `${process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'}/go/${linkId}`,
          commissionRate: data.commission,
          campaignName: data.productName,
          clicks: 0,
          conversions: 0
        }
      });
      
      // Update usage counter
      await tx.usage.upsert({
        where: { userId },
        update: { affiliateLinks: { increment: 1 } },
        create: {
          userId,
          contentPieces: 0,
          bundles: 0,
          affiliateLinks: 1,
          rewrites: 0
        }
      });
      
      return affiliateLink;
    });
  },

  /**
   * Track affiliate link click
   */
  async trackClick(linkId: string, data?: {
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
  }) {
    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Update click count
      const affiliateLink = await tx.affiliateLink.update({
        where: { linkId },
        data: { clicks: { increment: 1 } }
      });
      
      // Record click event (use ClickTracking instead of AffiliateClick)
      await tx.clickTracking.create({
        data: {
          linkId: affiliateLink.linkId,
          userAgent: data?.userAgent || null,
          referrer: data?.referrer || null,
          ip: data?.ipAddress || null
        }
      });
      
      return affiliateLink;
    });
  }
};

/**
 * Analytics Helpers
 */
export const analyticsHelpers = {
  /**
   * Get user dashboard data
   */
  async getDashboardData(userId: string, timeframe: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const [usage, recentContent, recentBundles, affiliateStats] = await Promise.all([
      prisma.usage.findUnique({
        where: { userId }
      }),
      prisma.contentPiece.count({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      }),
      prisma.bundle.count({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      }),
      prisma.affiliateLink.aggregate({
        where: { userId },
        _sum: {
          clicks: true,
          conversions: true
        }
      })
    ]);
    
    return {
      usage: usage || {
        contentPieces: 0,
        bundles: 0,
        affiliateLinks: 0,
        rewrites: 0
      },
      recent: {
        contentPieces: recentContent,
        bundles: recentBundles
      },
      affiliate: {
        totalClicks: affiliateStats._sum.clicks || 0,
        totalConversions: affiliateStats._sum.conversions || 0
      }
    };
  },

  /**
   * Record analytics event
   */
  async recordEvent(userId: string, eventType: string, eventData: any = {}) {
    return await prisma.event.create({
      data: {
        userId,
        event: eventType,
        metadata: eventData
      }
    });
  }
};

/**
 * Payment Helpers
 */
export const paymentHelpers = {
  /**
   * Create payment record
   */
  async createPayment(data: {
    userId: string;
    stripePaymentId: string;
    amount: number;
    currency: string;
    status: string;
    subscriptionId?: string;
  }) {
    return await prisma.payment.create({
      data: {
        userId: data.userId,
        stripeId: data.stripePaymentId,
        amount: data.amount,
        currency: data.currency,
        status: data.status as any
      }
    });
  },

  /**
   * Update subscription status
   */
  async updateSubscription(userId: string, data: {
    plan?: string;
    status?: string;
    stripeSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }) {
    return await prisma.subscription.upsert({
      where: { userId },
      update: {
        ...(data.plan && { plan: data.plan as 'FREE' | 'PRO' | 'ENTERPRISE' }),
        ...(data.status && { status: data.status as 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'UNPAID' | 'TRIAL' }),

        ...(data.currentPeriodStart && { currentPeriodStart: data.currentPeriodStart }),
        ...(data.currentPeriodEnd && { currentPeriodEnd: data.currentPeriodEnd })
      },
      create: {
        userId,
        plan: $Enums.Plan.FREE,
        status: $Enums.SubscriptionStatus.ACTIVE,
        ...data
      }
    });
  }
};

/**
 * Utility function for safe database operations with error handling
 */
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  errorMessage = 'Database operation failed'
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    console.error(`Database operation error: ${errorMessage}`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : errorMessage 
    };
  }
}