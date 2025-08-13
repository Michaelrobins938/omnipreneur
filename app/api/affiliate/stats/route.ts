import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import prisma from '@/lib/db';

/**
 * GET /api/affiliate/stats
 * 
 * Get affiliate program statistics for the authenticated user
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Check if user is enrolled in affiliate program
    const affiliateProfile = await prisma.event.findFirst({
      where: {
        userId: user.userId,
        event: 'AFFILIATE_ENROLLED'
      }
    });

    if (!affiliateProfile) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'NOT_ENROLLED', 
            message: 'User is not enrolled in affiliate program' 
          } 
        },
        { status: 404 }
      );
    }

    // In a real application, you would:
    // 1. Query affiliate tracking database for user's referral stats
    // 2. Calculate earnings based on commission structure
    // 3. Get click/conversion data from analytics
    // 4. Calculate tier progression
    // 5. Get payout schedule information

    // Mock affiliate stats
    const affiliateStats = {
      totalEarnings: 12450.75,
      pendingEarnings: 850.25,
      totalReferrals: 67,
      activeReferrals: 54,
      clicksThisMonth: 1247,
      conversionsThisMonth: 23,
      conversionRate: 1.85,
      avgOrderValue: 89.50,
      commissionRate: 30,
      nextPayoutDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      currentTier: 'Gold',
      affiliateCode: 'ABC123',
      enrolledDate: affiliateProfile.timestamp.toISOString()
    };

    // Calculate tier progression
    const tierThresholds = {
      bronze: 0,
      silver: 5000,
      gold: 15000,
      platinum: 50000
    };

    const currentTierData = Object.entries(tierThresholds)
      .reverse()
      .find(([_, threshold]) => affiliateStats.totalEarnings >= threshold);

    if (currentTierData) {
      affiliateStats.currentTier = currentTierData[0].charAt(0).toUpperCase() + currentTierData[0].slice(1);
    }

    // Get recent performance data
    const recentCommissions = await prisma.event.findMany({
      where: {
        userId: user.userId,
        event: 'AFFILIATE_COMMISSION_EARNED',
        timestamp: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: 10
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: affiliateStats,
        recentCommissions: recentCommissions.map(commission => ({
          id: commission.id,
          amount: commission.metadata?.amount || 0,
          type: commission.metadata?.type || 'unknown',
          date: commission.timestamp.toISOString(),
          referralId: commission.metadata?.referralId
        }))
      }
    });

  } catch (error: any) {
    console.error('Affiliate stats error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'STATS_ERROR', 
          message: 'Failed to fetch affiliate statistics' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  windowMs: 60 * 1000, // 1 minute
  max: 30 // 30 requests per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `affiliate-stats:${userId}:${ip}`;
}));