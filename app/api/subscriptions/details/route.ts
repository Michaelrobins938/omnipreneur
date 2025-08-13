import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';
import prisma from '@/lib/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || '', {
  apiVersion: '2025-06-30.basil',
});

/**
 * GET /api/subscriptions/details
 * 
 * Get comprehensive subscription details including current plan,
 * usage, billing info, and available plans
 * 
 * Authentication: Required
 */
export const GET = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    // Get user with subscription data
    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        subscription: true,
        usage: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        entitlements: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'USER_NOT_FOUND', 
            message: 'User not found' 
          } 
        },
        { status: 404 }
      );
    }

    // Calculate usage for current period
    const currentPeriodStart = userData.subscription?.currentPeriodStart || new Date();
    const currentPeriodEnd = userData.subscription?.currentPeriodEnd || new Date();

    // Get AI requests for current period
    const currentPeriodUsage = await prisma.aIRequest.count({
      where: {
        userId: user.userId,
        createdAt: {
          gte: currentPeriodStart,
          lte: currentPeriodEnd
        }
      }
    });

    // Get feature usage
    const featureUsage = await prisma.event.findMany({
      where: {
        userId: user.userId,
        event: { contains: 'TOOL_USED' },
        timestamp: {
          gte: currentPeriodStart,
          lte: currentPeriodEnd
        }
      },
      select: {
        metadata: true
      }
    });

    const featuresUsed = Array.from(new Set(
      featureUsage
        .map(event => event.metadata?.toolName)
        .filter(Boolean)
    ));

    // Define available plans
    const plans = {
      FREE: {
        name: 'Free Plan',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
          '1,000 AI Credits per month',
          'Basic content generation',
          'Email support',
          'Community access'
        ],
        limits: {
          aiCredits: 1000,
          projects: 3,
          teammembers: 1
        }
      },
      PRO: {
        name: 'Pro Plan',
        monthlyPrice: 4900, // $49.00
        yearlyPrice: 49000, // $490.00 ($40.83/month)
        features: [
          '25,000 AI Credits per month',
          'Advanced content generation',
          'All AI tools included',
          'Priority support',
          'Advanced analytics',
          'Export capabilities',
          'Custom templates'
        ],
        limits: {
          aiCredits: 25000,
          projects: 25,
          teammembers: 5
        }
      },
      ENTERPRISE: {
        name: 'Enterprise Plan',
        monthlyPrice: 19900, // $199.00
        yearlyPrice: 199000, // $1,990.00 ($165.83/month)
        features: [
          'Unlimited AI Credits',
          'White-label options',
          'Custom integrations',
          'Dedicated support',
          'Advanced security',
          'Custom workflows',
          'API access',
          'Analytics dashboard',
          'Team collaboration',
          'Priority processing'
        ],
        limits: {
          aiCredits: -1, // Unlimited
          projects: -1, // Unlimited
          teammembers: -1 // Unlimited
        }
      }
    };

    // Get upcoming invoice from Stripe if subscription exists
    let upcomingInvoice = null;
    if (userData.subscription?.stripeId) {
      try {
        const invoice = await stripe.invoices.retrieveUpcoming({
          customer: userData.subscription.stripeId
        });
        
        upcomingInvoice = {
          amount: invoice.amount_due / 100, // Convert from cents
          date: new Date(invoice.next_payment_attempt * 1000).toISOString(),
          description: invoice.lines.data[0]?.description || 'Subscription renewal'
        };
      } catch (error) {
        console.log('No upcoming invoice found or error fetching:', error);
      }
    }

    // Get payment methods from Stripe
    let paymentMethods: any[] = [];
    if (userData.subscription?.stripeId) {
      try {
        const methods = await stripe.paymentMethods.list({
          customer: userData.subscription.stripeId,
          type: 'card'
        });
        paymentMethods = methods.data.map(method => ({
          id: method.id,
          brand: method.card?.brand,
          last4: method.card?.last4,
          exp_month: method.card?.exp_month,
          exp_year: method.card?.exp_year,
          default: method.id === userData.subscription?.defaultPaymentMethod
        }));
      } catch (error) {
        console.log('Error fetching payment methods:', error);
      }
    }

    // Prepare response data
    const responseData = {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name
      },
      subscription: userData.subscription ? {
        id: userData.subscription.id,
        plan: userData.subscription.plan,
        status: userData.subscription.status,
        currentPeriodStart: userData.subscription.currentPeriodStart?.toISOString(),
        currentPeriodEnd: userData.subscription.currentPeriodEnd?.toISOString(),
        cancelAtPeriodEnd: userData.subscription.cancelAtPeriodEnd,
        billingCycle: userData.subscription.billingCycle || 'monthly',
        trialEndsAt: userData.subscription.trialEndsAt?.toISOString(),
        lastPayment: userData.payments[0]?.amount,
        nextPayment: upcomingInvoice?.amount
      } : null,
      usage: {
        aiCreditsUsed: userData.usage?.aiCreditsUsed || currentPeriodUsage,
        aiCreditsLimit: plans[userData.subscription?.plan as keyof typeof plans]?.limits.aiCredits || plans.FREE.limits.aiCredits,
        featuresUsed: featuresUsed as string[],
        currentBillingPeriodUsage: currentPeriodUsage
      },
      plans,
      paymentMethods,
      recentPayments: userData.payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        productName: payment.productName,
        plan: payment.plan,
        createdAt: payment.createdAt.toISOString()
      })),
      upcomingInvoice
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error: any) {
    console.error('Subscription details error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'DETAILS_ERROR', 
          message: 'Failed to fetch subscription details' 
        } 
      },
      { status: 500 }
    );
  }
}), {
  windowMs: 60 * 1000, // 1 minute
  max: 20 // 20 requests per minute
}, (req: NextRequest) => {
  const userId = (req as any).user?.userId;
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  return `subscription-details:${userId}:${ip}`;
}));