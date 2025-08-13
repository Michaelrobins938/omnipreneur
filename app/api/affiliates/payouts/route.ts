// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-middleware';
import { withRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const PayoutRequestSchema = z.object({
  method: z.enum(['PAYPAL', 'BANK_TRANSFER', 'STRIPE']),
  paypalEmail: z.string().email().optional(),
  bankDetails: z.object({
    accountNumber: z.string(),
    routingNumber: z.string(),
    accountHolderName: z.string(),
    bankName: z.string()
  }).optional()
});

/**
 * GET /api/affiliates/payouts
 * 
 * Get affiliate's payout history and current balance
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: user.userId },
      include: {
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        commissions: {
          where: { status: 'PENDING' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_AFFILIATE', message: 'User is not an affiliate' }
      }, { status: 403 });
    }

    if (affiliate.status !== 'APPROVED') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_APPROVED', message: 'Affiliate account not approved' }
      }, { status: 403 });
    }

    // Calculate pending earnings breakdown
    const pendingCommissions = affiliate.commissions.map(commission => ({
      id: commission.id,
      type: commission.type,
      amount: commission.amount,
      description: commission.description,
      subscriptionPlan: commission.subscriptionPlan,
      createdAt: commission.createdAt
    }));

    const minimumPayout = 50; // $50 minimum payout
    const canRequestPayout = affiliate.pendingEarnings >= minimumPayout;

    return NextResponse.json({
      success: true,
      data: {
        balance: {
          pending: affiliate.pendingEarnings,
          paid: affiliate.paidEarnings,
          total: affiliate.totalEarnings,
          canRequestPayout,
          minimumPayout
        },
        pendingCommissions,
        payoutHistory: affiliate.payouts.map(payout => ({
          id: payout.id,
          amount: payout.amount,
          netAmount: payout.netAmount,
          fees: payout.fees,
          status: payout.status,
          method: payout.method,
          processedAt: payout.processedAt,
          failureReason: payout.failureReason,
          periodStart: payout.periodStart,
          periodEnd: payout.periodEnd,
          commissionsCount: payout.commissionsCount,
          createdAt: payout.createdAt
        })),
        payoutSettings: {
          method: affiliate.payoutMethod,
          paypalEmail: affiliate.paypalEmail,
          hasBankDetails: !!affiliate.bankDetails
        }
      }
    });

  } catch (error) {
    console.error('Get payouts error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'PAYOUT_ERROR', message: 'Failed to get payout information' }
    }, { status: 500 });
  }
}, {
  limit: 30,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => `affiliate-payouts:${(req as any).user?.userId}`
}));

/**
 * POST /api/affiliates/payouts
 * 
 * Request a payout of pending earnings
 */
export const POST = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { method, paypalEmail, bankDetails } = PayoutRequestSchema.parse(body);

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: user.userId },
      include: {
        commissions: {
          where: { status: 'PENDING' }
        }
      }
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_AFFILIATE', message: 'User is not an affiliate' }
      }, { status: 403 });
    }

    if (affiliate.status !== 'APPROVED') {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_APPROVED', message: 'Affiliate account not approved' }
      }, { status: 403 });
    }

    const minimumPayout = 50;
    if (affiliate.pendingEarnings < minimumPayout) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MINIMUM_NOT_MET',
          message: `Minimum payout amount is $${minimumPayout}`,
          currentAmount: affiliate.pendingEarnings
        }
      }, { status: 400 });
    }

    // Check if there's already a pending payout
    const existingPendingPayout = await prisma.affiliatePayout.findFirst({
      where: {
        affiliateId: affiliate.id,
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    });

    if (existingPendingPayout) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'PAYOUT_PENDING',
          message: 'You already have a pending payout request'
        }
      }, { status: 409 });
    }

    // Calculate fees (2.9% for PayPal, $3 for bank transfer)
    const payoutAmount = affiliate.pendingEarnings;
    let fees = 0;
    let netAmount = payoutAmount;

    if (method === 'PAYPAL') {
      fees = Math.round(payoutAmount * 0.029 * 100) / 100; // 2.9%
      netAmount = payoutAmount - fees;
    } else if (method === 'BANK_TRANSFER') {
      fees = 3.00; // $3 flat fee
      netAmount = payoutAmount - fees;
    }

    await prisma.$transaction(async (tx) => {
      // Create payout record
      const payout = await tx.affiliatePayout.create({
        data: {
          affiliateId: affiliate.id,
          amount: payoutAmount,
          netAmount,
          fees,
          status: 'PENDING',
          method,
          periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          periodEnd: new Date(),
          commissionsCount: affiliate.commissions.length
        }
      });

      // Update affiliate payout method if provided
      const updateData: any = {};
      if (method !== affiliate.payoutMethod) {
        updateData.payoutMethod = method;
      }
      if (paypalEmail && method === 'PAYPAL') {
        updateData.paypalEmail = paypalEmail;
      }
      if (bankDetails && method === 'BANK_TRANSFER') {
        updateData.bankDetails = bankDetails; // Should be encrypted in production
      }

      if (Object.keys(updateData).length > 0) {
        await tx.affiliate.update({
          where: { id: affiliate.id },
          data: updateData
        });
      }

      // Mark commissions as approved (pending payout)
      await tx.commission.updateMany({
        where: {
          affiliateId: affiliate.id,
          status: 'PENDING'
        },
        data: {
          status: 'APPROVED',
          payoutId: payout.id
        }
      });

      // Update affiliate earnings
      await tx.affiliate.update({
        where: { id: affiliate.id },
        data: {
          pendingEarnings: 0, // Move to processing
          // Don't update paidEarnings until payout is completed
        }
      });

      // Log payout request
      await tx.event.create({
        data: {
          userId: user.userId,
          event: 'affiliate_payout_requested',
          metadata: {
            payoutId: payout.id,
            amount: payoutAmount,
            netAmount,
            fees,
            method,
            commissionsCount: affiliate.commissions.length
          }
        }
      });
    });

    // TODO: Queue payout for processing
    // TODO: Send confirmation email

    return NextResponse.json({
      success: true,
      data: {
        message: 'Payout request submitted successfully',
        amount: payoutAmount,
        netAmount,
        fees,
        method,
        estimatedProcessingTime: method === 'PAYPAL' ? '1-2 business days' : '3-5 business days'
      }
    });

  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid payout request data',
          details: error.issues
        }
      }, { status: 400 });
    }

    console.error('Request payout error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'PAYOUT_ERROR', message: 'Failed to process payout request' }
    }, { status: 500 });
  }
}, {
  limit: 5, // 5 payout requests per window
  windowMs: 60 * 60 * 1000, // 1 hour
  key: (req: NextRequest) => `affiliate-payout-request:${(req as any).user?.userId}`
}));

/**
 * PUT /api/affiliates/payouts
 * 
 * Update payout settings
 */
export const PUT = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    const { method, paypalEmail, bankDetails } = PayoutRequestSchema.parse(body);

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: user.userId }
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        error: { code: 'NOT_AFFILIATE', message: 'User is not an affiliate' }
      }, { status: 403 });
    }

    const updateData: any = { payoutMethod: method };
    
    if (method === 'PAYPAL' && paypalEmail) {
      updateData.paypalEmail = paypalEmail;
    }
    
    if (method === 'BANK_TRANSFER' && bankDetails) {
      // In production, encrypt bank details
      updateData.bankDetails = bankDetails;
    }

    await prisma.affiliate.update({
      where: { id: affiliate.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Payout settings updated successfully' }
    });

  } catch (error: any) {
    if (error?.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid settings data',
          details: error.issues
        }
      }, { status: 400 });
    }

    console.error('Update payout settings error:', error);
    return NextResponse.json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to update payout settings' }
    }, { status: 500 });
  }
}, {
  limit: 10,
  windowMs: 60 * 1000,
  key: (req: NextRequest) => `affiliate-payout-settings:${(req as any).user?.userId}`
}));