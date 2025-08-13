import prisma from '@/lib/db';

/**
 * Handle commission creation when a referred user subscribes
 */
export async function handleSubscriptionCommission(
  userId: string,
  subscriptionData: {
    plan: string;
    amount: number;
    subscriptionId: string;
    isUpgrade?: boolean;
    previousPlan?: string;
  }
) {
  try {
    // Find if this user was referred by an affiliate
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        referredBy: true,
        referralSource: true
      }
    });

    if (!user?.referredBy || user.referralSource !== 'affiliate') {
      return null; // No affiliate referral
    }

    // Find the affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { 
        referralCode: user.referredBy,
        status: 'APPROVED'
      }
    });

    if (!affiliate) {
      console.warn(`Affiliate not found or not approved for referral code: ${user.referredBy}`);
      return null;
    }

    const commissionAmount = subscriptionData.amount * affiliate.commissionRate;

    return await prisma.$transaction(async (tx) => {
      // Update or create referral record
      const existingReferral = await tx.referral.findFirst({
        where: {
          affiliateId: affiliate.id,
          referredUserId: userId
        }
      });

      if (existingReferral) {
        // Update existing referral with conversion data
        await tx.referral.update({
          where: { id: existingReferral.id },
          data: {
            status: 'CONVERTED',
            conversionTimestamp: new Date(),
            subscriptionId: subscriptionData.subscriptionId,
            subscriptionPlan: subscriptionData.plan,
            subscriptionAmount: subscriptionData.amount,
            commissionAmount,
            commissionPaid: false
          }
        });
      } else {
        // Create new referral record (this can happen if tracking was missed)
        await tx.referral.create({
          data: {
            affiliateId: affiliate.id,
            referredUserId: userId,
            status: 'CONVERTED',
            clickTimestamp: new Date(), // Approximate
            signupTimestamp: new Date(), // Approximate
            conversionTimestamp: new Date(),
            subscriptionId: subscriptionData.subscriptionId,
            subscriptionPlan: subscriptionData.plan,
            subscriptionAmount: subscriptionData.amount,
            commissionAmount,
            commissionPaid: false
          }
        });
      }

      // Create commission record
      const commission = await tx.commission.create({
        data: {
          affiliateId: affiliate.id,
          type: subscriptionData.isUpgrade ? 'REFERRAL' : 'REFERRAL',
          amount: commissionAmount,
          status: 'PENDING',
          subscriptionId: subscriptionData.subscriptionId,
          subscriptionPlan: subscriptionData.plan,
          description: `${subscriptionData.isUpgrade ? 'Upgrade' : 'New'} subscription commission for ${subscriptionData.plan} plan`,
          metadata: {
            isUpgrade: subscriptionData.isUpgrade,
            previousPlan: subscriptionData.previousPlan,
            originalAmount: subscriptionData.amount
          }
        }
      });

      // Update affiliate earnings and stats
      await tx.affiliate.update({
        where: { id: affiliate.id },
        data: {
          conversions: { increment: 1 },
          pendingEarnings: { increment: commissionAmount },
          totalEarnings: { increment: commissionAmount },
          conversionRate: {
            set: (affiliate.conversions + 1) / Math.max(affiliate.clicksGenerated, 1)
          }
        }
      });

      // Log commission event
      await tx.event.create({
        data: {
          userId: affiliate.userId,
          event: 'commission_earned',
          metadata: {
            commissionId: commission.id,
            affiliateId: affiliate.id,
            referredUserId: userId,
            subscriptionPlan: subscriptionData.plan,
            amount: commissionAmount,
            subscriptionAmount: subscriptionData.amount,
            commissionRate: affiliate.commissionRate
          }
        }
      });

      return {
        commissionId: commission.id,
        amount: commissionAmount,
        affiliateId: affiliate.id
      };
    });

  } catch (error) {
    console.error('Error handling subscription commission:', error);
    // Don't throw - we don't want affiliate commission errors to break subscriptions
    return null;
  }
}

/**
 * Handle commission cancellation when a subscription is refunded/cancelled
 */
export async function handleSubscriptionRefund(
  userId: string,
  subscriptionId: string,
  reason: 'refund' | 'cancellation' | 'chargeback'
) {
  try {
    // Find the referral and associated commission
    const referral = await prisma.referral.findFirst({
      where: {
        referredUserId: userId,
        subscriptionId,
        status: 'CONVERTED'
      },
      include: {
        affiliate: true
      }
    });

    if (!referral) {
      return null; // No affiliate referral found
    }

    await prisma.$transaction(async (tx) => {
      // Update referral status
      await tx.referral.update({
        where: { id: referral.id },
        data: {
          status: reason === 'refund' ? 'REFUNDED' : 'CANCELLED'
        }
      });

      // Find and cancel the commission
      const commission = await tx.commission.findFirst({
        where: {
          affiliateId: referral.affiliateId,
          subscriptionId,
          status: { in: ['PENDING', 'APPROVED'] } // Only cancel unpaid commissions
        }
      });

      if (commission) {
        await tx.commission.update({
          where: { id: commission.id },
          data: {
            status: 'CANCELLED',
            metadata: {
              ...commission.metadata as object,
              cancellationReason: reason,
              cancelledAt: new Date().toISOString()
            }
          }
        });

        // Update affiliate earnings (only if commission was pending)
        if (commission.status === 'PENDING') {
          await tx.affiliate.update({
            where: { id: referral.affiliateId },
            data: {
              pendingEarnings: { decrement: commission.amount },
              totalEarnings: { decrement: commission.amount },
              conversions: { decrement: 1 }
            }
          });
        }

        // Log cancellation event
        await tx.event.create({
          data: {
            userId: referral.affiliate.userId,
            event: 'commission_cancelled',
            metadata: {
              commissionId: commission.id,
              affiliateId: referral.affiliateId,
              referredUserId: userId,
              amount: commission.amount,
              reason,
              originalSubscriptionId: subscriptionId
            }
          }
        });
      }
    });

    return { cancelled: true, amount: 0 };

  } catch (error) {
    console.error('Error handling subscription refund:', error);
    return null;
  }
}

/**
 * Handle recurring commission for monthly subscriptions
 */
export async function handleRecurringCommission(
  subscriptionId: string,
  billingPeriod: { start: Date; end: Date },
  amount: number
) {
  try {
    // Find referral for this subscription
    const referral = await prisma.referral.findFirst({
      where: {
        subscriptionId,
        status: 'CONVERTED'
      },
      include: {
        affiliate: true
      }
    });

    if (!referral || referral.affiliate.status !== 'APPROVED') {
      return null;
    }

    // Check if we should give recurring commissions (e.g., first 3 months only)
    const monthsSinceConversion = Math.floor(
      (new Date().getTime() - referral.conversionTimestamp!.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    const maxRecurringMonths = 3; // Give commission for first 3 months only
    if (monthsSinceConversion >= maxRecurringMonths) {
      return null; // No more recurring commissions
    }

    const recurringCommissionRate = referral.affiliate.commissionRate * 0.5; // 50% of normal rate for recurring
    const commissionAmount = amount * recurringCommissionRate;

    return await prisma.$transaction(async (tx) => {
      // Create recurring commission
      const commission = await tx.commission.create({
        data: {
          affiliateId: referral.affiliateId,
          referralId: referral.id,
          type: 'RECURRING',
          amount: commissionAmount,
          status: 'PENDING',
          subscriptionId,
          subscriptionPlan: referral.subscriptionPlan!,
          recurringMonths: monthsSinceConversion + 1,
          description: `Month ${monthsSinceConversion + 1} recurring commission`,
          metadata: {
            billingPeriodStart: billingPeriod.start.toISOString(),
            billingPeriodEnd: billingPeriod.end.toISOString(),
            monthNumber: monthsSinceConversion + 1,
            recurringRate: recurringCommissionRate
          }
        }
      });

      // Update affiliate earnings
      await tx.affiliate.update({
        where: { id: referral.affiliateId },
        data: {
          pendingEarnings: { increment: commissionAmount },
          totalEarnings: { increment: commissionAmount }
        }
      });

      return {
        commissionId: commission.id,
        amount: commissionAmount,
        month: monthsSinceConversion + 1
      };
    });

  } catch (error) {
    console.error('Error handling recurring commission:', error);
    return null;
  }
}

/**
 * Get affiliate performance analytics
 */
export async function getAffiliateAnalytics(affiliateId: string, period: 'week' | 'month' | 'quarter' | 'year' = 'month') {
  const now = new Date();
  const start = new Date();
  
  switch (period) {
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
  }

  const [clicks, referrals, commissions] = await Promise.all([
    prisma.affiliateClick.count({
      where: {
        affiliateId,
        timestamp: { gte: start }
      }
    }),
    
    prisma.referral.findMany({
      where: {
        affiliateId,
        clickTimestamp: { gte: start }
      },
      select: {
        status: true,
        commissionAmount: true,
        subscriptionPlan: true
      }
    }),
    
    prisma.commission.aggregate({
      where: {
        affiliateId,
        createdAt: { gte: start }
      },
      _sum: { amount: true },
      _count: true
    })
  ]);

  const conversions = referrals.filter(r => r.status === 'CONVERTED').length;
  const totalCommissionValue = referrals.reduce((sum, r) => sum + (r.commissionAmount || 0), 0);

  return {
    period,
    clicks,
    signups: referrals.length,
    conversions,
    clickToSignupRate: clicks > 0 ? (referrals.length / clicks) * 100 : 0,
    signupToConversionRate: referrals.length > 0 ? (conversions / referrals.length) * 100 : 0,
    conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
    earnings: commissions._sum.amount || 0,
    avgCommissionPerConversion: conversions > 0 ? (commissions._sum.amount || 0) / conversions : 0,
    topConvertingPlans: getTopPlans(referrals.filter(r => r.status === 'CONVERTED'))
  };
}

function getTopPlans(convertedReferrals: any[]) {
  const planCounts = convertedReferrals.reduce((acc, referral) => {
    const plan = referral.subscriptionPlan || 'Unknown';
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(planCounts)
    .sort(([,a], [,b]) => (Number(b) || 0) - (Number(a) || 0))
    .slice(0, 3)
    .map(([plan, count]) => ({ plan, conversions: count }));
}