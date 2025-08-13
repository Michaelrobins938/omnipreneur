// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';

/**
 * GET /api/affiliates/dashboard
 * 
 * Get affiliate dashboard data including stats, earnings, and referrals
 * 
 * Authentication: Required (Affiliate only)
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'month'; // week, month, quarter, year, all

    // Get affiliate record
    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: user.userId },
      include: {
        referrals: {
          include: {
            referredUser: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
              }
            }
          }
        },
        commissions: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_AFFILIATE',
          message: 'User is not an affiliate'
        }
      }, { status: 403 });
    }

    if (affiliate.status !== 'APPROVED') {
      return NextResponse.json({
        success: true,
        data: {
          status: affiliate.status,
          message: getStatusMessage(affiliate.status),
          rejectionReason: affiliate.rejectionReason
        }
      });
    }

    // Calculate time range
    const timeRanges = getTimeRange(timeframe);
    
    // Get performance statistics
    const stats = await getAffiliateStats(affiliate.id, timeRanges);
    
    // Get recent referrals with detailed info
    const recentReferrals = affiliate.referrals
      .filter(referral => {
        if (timeframe === 'all') return true;
        return referral.clickTimestamp >= timeRanges.start;
      })
      .slice(0, 20)
      .map(referral => ({
        id: referral.id,
        user: {
          name: referral.referredUser.name,
          email: referral.referredUser.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email
        },
        status: referral.status,
        subscriptionPlan: referral.subscriptionPlan,
        commissionAmount: referral.commissionAmount,
        clickDate: referral.clickTimestamp,
        signupDate: referral.signupTimestamp,
        conversionDate: referral.conversionTimestamp
      }));

    // Get commission history
    const commissionHistory = affiliate.commissions
      .filter(commission => {
        if (timeframe === 'all') return true;
        return commission.createdAt >= timeRanges.start;
      })
      .map(commission => ({
        id: commission.id,
        type: commission.type,
        amount: commission.amount,
        status: commission.status,
        description: commission.description,
        subscriptionPlan: commission.subscriptionPlan,
        createdAt: commission.createdAt,
        paidAt: commission.paidAt
      }));

    // Generate marketing materials
    const marketingMaterials = generateMarketingMaterials(affiliate.affiliateCode, affiliate.referralCode);

    return NextResponse.json({
      success: true,
      data: {
        affiliate: {
          id: affiliate.id,
          affiliateCode: affiliate.affiliateCode,
          referralCode: affiliate.referralCode,
          status: affiliate.status,
          commissionRate: affiliate.commissionRate,
          totalEarnings: affiliate.totalEarnings,
          pendingEarnings: affiliate.pendingEarnings,
          paidEarnings: affiliate.paidEarnings,
          approvedAt: affiliate.approvedAt
        },
        stats,
        recentReferrals,
        commissionHistory,
        payoutHistory: affiliate.payouts.map(payout => ({
          id: payout.id,
          amount: payout.amount,
          netAmount: payout.netAmount,
          status: payout.status,
          method: payout.method,
          processedAt: payout.processedAt,
          periodStart: payout.periodStart,
          periodEnd: payout.periodEnd
        })),
        marketingMaterials
      }
    });

  } catch (error) {
    console.error('Affiliate dashboard error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'DASHBOARD_ERROR',
        message: 'Failed to load affiliate dashboard'
      }
    }, { status: 500 });
  }
}, {
  limit: 60, // 60 requests per window
  windowMs: 60 * 1000, // 1 minute
  key: (req: NextRequest) => `affiliate-dashboard:${(req as any).user?.userId}`
}));

// Helper functions
function getStatusMessage(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Your affiliate application is under review. We will notify you within 2-3 business days.';
    case 'REJECTED':
      return 'Your affiliate application was not approved. Please see the reason below.';
    case 'SUSPENDED':
      return 'Your affiliate account is temporarily suspended. Contact support for more information.';
    case 'TERMINATED':
      return 'Your affiliate account has been terminated.';
    default:
      return 'Unknown status';
  }
}

function getTimeRange(timeframe: string) {
  const now = new Date();
  const start = new Date();

  switch (timeframe) {
    case 'week':
      start.setDate(now.getDate() - 7);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      start.setFullYear(2020); // Beginning of time
      break;
    default:
      start.setMonth(now.getMonth() - 1);
  }

  return { start, end: now };
}

async function getAffiliateStats(affiliateId: string, timeRange: { start: Date; end: Date }) {
  const [clickStats, referralStats, commissionStats] = await Promise.all([
    // Click statistics
    prisma.affiliateClick.aggregate({
      where: {
        affiliateId,
        timestamp: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      },
      _count: true
    }),

    // Referral statistics
    prisma.referral.groupBy({
      by: ['status'],
      where: {
        affiliateId,
        clickTimestamp: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      },
      _count: true
    }),

    // Commission statistics
    prisma.commission.aggregate({
      where: {
        affiliateId,
        createdAt: {
          gte: timeRange.start,
          lte: timeRange.end
        }
      },
      _sum: {
        amount: true
      },
      _count: true
    })
  ]);

  const totalClicks = clickStats._count;
  const referralCounts = referralStats.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  const totalSignups = (referralCounts['SIGNED_UP'] || 0) + (referralCounts['CONVERTED'] || 0);
  const totalConversions = referralCounts['CONVERTED'] || 0;
  const totalCommissions = commissionStats._sum.amount || 0;

  return {
    clicks: totalClicks,
    signups: totalSignups,
    conversions: totalConversions,
    earnings: totalCommissions,
    clickToSignupRate: totalClicks > 0 ? (totalSignups / totalClicks) * 100 : 0,
    signupToConversionRate: totalSignups > 0 ? (totalConversions / totalSignups) * 100 : 0,
    overallConversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
    averageCommissionPerConversion: totalConversions > 0 ? totalCommissions / totalConversions : 0
  };
}

function generateMarketingMaterials(affiliateCode: string, referralCode: string) {
  const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'https://omnipreneur.ai';
  
  return {
    links: {
      homepage: `${baseUrl}?ref=${referralCode}`,
      pricing: `${baseUrl}/pricing?ref=${referralCode}`,
      products: `${baseUrl}/products?ref=${referralCode}`,
      novus: `${baseUrl}/products/novus-protocol?ref=${referralCode}`,
      autorewrite: `${baseUrl}/products/auto-rewrite?ref=${referralCode}`
    },
    trackingUrls: {
      homepage: `${baseUrl}/api/affiliates/track/${affiliateCode}?url=/`,
      pricing: `${baseUrl}/api/affiliates/track/${affiliateCode}?url=/pricing`,
      products: `${baseUrl}/api/affiliates/track/${affiliateCode}?url=/products`
    },
    banners: [
      {
        size: '728x90',
        title: 'Omnipreneur AI Platform - Leaderboard',
        description: '27 AI-powered business tools in one platform'
      },
      {
        size: '300x250',
        title: 'Omnipreneur AI Platform - Rectangle',
        description: 'Transform your business with AI'
      },
      {
        size: '160x600',
        title: 'Omnipreneur AI Platform - Skyscraper',
        description: 'AI tools for entrepreneurs'
      }
    ],
    emailTemplates: [
      {
        subject: 'Transform Your Business with 27 AI Tools',
        preview: 'Discover the all-in-one AI platform that scales your business...'
      },
      {
        subject: 'Limited Time: 30% Off Omnipreneur AI Platform',
        preview: 'Get access to NOVUS Protocol, AutoRewrite Engine, and 25 more AI tools...'
      }
    ],
    socialPosts: [
      {
        platform: 'Twitter',
        text: `🚀 Just discovered @OmnipreneurAI - 27 AI business tools in one platform! From NOVUS Protocol to AutoRewrite Engine, this is a game-changer for entrepreneurs. Check it out: ${baseUrl}?ref=${referralCode}`
      },
      {
        platform: 'LinkedIn',
        text: `Entrepreneurs: Stop juggling 20+ AI tools. Omnipreneur consolidates everything you need into one powerful platform. 27 AI tools including content generation, SEO optimization, project management, and more. Perfect for scaling your business efficiently.`
      }
    ]
  };
}