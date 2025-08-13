// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const AdminActionSchema = z.object({
  action: z.enum(['approve', 'reject', 'suspend', 'activate', 'update_commission']),
  affiliateId: z.string(),
  reason: z.string().optional(),
  newCommissionRate: z.number().min(0).max(1).optional()
});

/**
 * GET /api/affiliates/admin
 * 
 * Get all affiliate applications and accounts (Admin only)
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { affiliateCode: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [affiliates, total] = await Promise.all([
      prisma.affiliate.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true
            }
          },
          referrals: {
            select: {
              status: true,
              commissionAmount: true
            }
          },
          commissions: {
            select: {
              amount: true,
              status: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.affiliate.count({ where })
    ]);

    // Calculate summary stats for each affiliate
    const affiliatesWithStats = affiliates.map(affiliate => {
      const totalReferrals = affiliate.referrals.length;
      const conversions = affiliate.referrals.filter(r => r.status === 'CONVERTED').length;
      const totalCommissions = affiliate.commissions.reduce((sum, c) => sum + c.amount, 0);
      const pendingCommissions = affiliate.commissions
        .filter(c => c.status === 'PENDING')
        .reduce((sum, c) => sum + c.amount, 0);

      return {
        id: affiliate.id,
        affiliateCode: affiliate.affiliateCode,
        referralCode: affiliate.referralCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        user: affiliate.user,
        companyName: affiliate.companyName,
        website: affiliate.website,
        niche: affiliate.niche,
        marketingMethod: affiliate.marketingMethod,
        audienceSize: affiliate.audienceSize,
        payoutMethod: affiliate.payoutMethod,
        stats: {
          totalClicks: affiliate.clicksGenerated,
          totalReferrals,
          conversions,
          conversionRate: affiliate.conversionRate,
          totalEarnings: affiliate.totalEarnings,
          pendingEarnings: affiliate.pendingEarnings,
          totalCommissions,
          pendingCommissions
        },
        createdAt: affiliate.createdAt,
        approvedAt: affiliate.approvedAt,
        rejectedAt: affiliate.rejectedAt,
        rejectionReason: affiliate.rejectionReason
      };
    });

    // Get overall platform stats
    const platformStats = await getPlatformAffiliateStats();

    return NextResponse.json({
      success: true,
      data: {
        affiliates: affiliatesWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        platformStats
      }
    });

  } catch (error) {
    console.error('Admin affiliate dashboard error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'ADMIN_ERROR', message: 'Failed to load admin dashboard' }
    }, { status: 500 });
  }
}, {
  limit: 100,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => `affiliate-admin:${(req as any).user?.userId}`
}));

/**
 * POST /api/affiliates/admin
 * 
 * Admin actions on affiliate accounts
 */
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    
    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return NextResponse.json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Admin access required' }
      }, { status: 403 });
    }

    const body = await request.json();
    const { action, affiliateId, reason, newCommissionRate } = AdminActionSchema.parse(body);

    const affiliate = await prisma.affiliate.findUnique({
      where: { id: affiliateId },
      include: { user: true }
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Affiliate not found' }
      }, { status: 404 });
    }

    let updateData: any = {};
    let eventType = '';

    switch (action) {
      case 'approve':
        updateData = {
          status: 'APPROVED',
          approvedAt: new Date(),
          rejectedAt: null,
          rejectionReason: null
        };
        eventType = 'affiliate_approved';
        break;

      case 'reject':
        updateData = {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectionReason: reason
        };
        eventType = 'affiliate_rejected';
        break;

      case 'suspend':
        updateData = {
          status: 'SUSPENDED'
        };
        eventType = 'affiliate_suspended';
        break;

      case 'activate':
        updateData = {
          status: 'APPROVED'
        };
        eventType = 'affiliate_activated';
        break;

      case 'update_commission':
        if (!newCommissionRate) {
          return NextResponse.json({
            success: false,
            error: { code: 'INVALID_DATA', message: 'Commission rate required' }
          }, { status: 400 });
        }
        updateData = {
          commissionRate: newCommissionRate
        };
        eventType = 'affiliate_commission_updated';
        break;
    }

    // Update affiliate
    const updatedAffiliate = await prisma.affiliate.update({
      where: { id: affiliateId },
      data: updateData
    });

    // Log admin action
    await prisma.event.create({
      data: {
        userId: user.userId,
        event: eventType,
        metadata: {
          affiliateId,
          affiliateCode: affiliate.affiliateCode,
          targetUserId: affiliate.userId,
          action,
          reason,
          newCommissionRate,
          oldStatus: affiliate.status,
          newStatus: updateData.status || affiliate.status
        }
      }
    });

    // TODO: Send email notification to affiliate about status change

    return NextResponse.json({
      success: true,
      data: {
        affiliate: updatedAffiliate,
        message: `Affiliate ${action} successfully`
      }
    });

  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.issues
        }
      }, { status: 400 });
    }

    console.error('Admin action error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'ACTION_ERROR', message: 'Failed to perform admin action' }
    }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => `affiliate-admin-action:${(req as any).user?.userId}`
}));

async function getPlatformAffiliateStats() {
  const [affiliateStats, referralStats, commissionStats, payoutStats] = await Promise.all([
    // Affiliate counts by status
    prisma.affiliate.groupBy({
      by: ['status'],
      _count: true
    }),

    // Referral stats
    prisma.referral.aggregate({
      _count: true,
      _sum: {
        commissionAmount: true
      }
    }),

    // Commission stats
    prisma.commission.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      },
      _count: true
    }),

    // Payout stats
    prisma.affiliatePayout.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      },
      _count: true
    })
  ]);

  const affiliateCounts = affiliateStats.reduce((acc, item) => {
    acc[item.status] = item._count;
    return acc;
  }, {} as Record<string, number>);

  const commissionTotals = commissionStats.reduce((acc, item) => {
    acc[item.status] = {
      count: item._count,
      amount: item._sum.amount || 0
    };
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  const payoutTotals = payoutStats.reduce((acc, item) => {
    acc[item.status] = {
      count: item._count,
      amount: item._sum.amount || 0
    };
    return acc;
  }, {} as Record<string, { count: number; amount: number }>);

  return {
    affiliates: {
      total: Object.values(affiliateCounts).reduce((sum, count) => sum + count, 0),
      pending: affiliateCounts['PENDING'] || 0,
      approved: affiliateCounts['APPROVED'] || 0,
      rejected: affiliateCounts['REJECTED'] || 0,
      suspended: affiliateCounts['SUSPENDED'] || 0
    },
    referrals: {
      total: referralStats._count,
      totalCommissionValue: referralStats._sum.commissionAmount || 0
    },
    commissions: {
      pending: commissionTotals['PENDING'] || { count: 0, amount: 0 },
      approved: commissionTotals['APPROVED'] || { count: 0, amount: 0 },
      paid: commissionTotals['PAID'] || { count: 0, amount: 0 },
      total: Object.values(commissionTotals).reduce(
        (acc, item) => ({
          count: acc.count + item.count,
          amount: acc.amount + item.amount
        }),
        { count: 0, amount: 0 }
      )
    },
    payouts: {
      pending: payoutTotals['PENDING'] || { count: 0, amount: 0 },
      completed: payoutTotals['COMPLETED'] || { count: 0, amount: 0 },
      failed: payoutTotals['FAILED'] || { count: 0, amount: 0 }
    }
  };
}