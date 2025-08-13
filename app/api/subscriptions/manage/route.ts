// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { sendSimpleEmail } from '@/lib/email';
import Stripe from 'stripe';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';

// Using shared Prisma client
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || '', {
  apiVersion: '2025-06-30.basil',
});

// Plan pricing configuration
const PLAN_PRICES = {
  PRO: { monthly: 4900, yearly: 49000, stripePriceId: 'price_pro_monthly' }, // $49/month
  ENTERPRISE: { monthly: 19900, yearly: 199000, stripePriceId: 'price_enterprise_monthly' } // $199/month
};

// Validation schema
const ManageSubscriptionSchema = z.object({
  action: z.enum(['upgrade', 'downgrade', 'cancel', 'reactivate']),
  plan: z.enum(['FREE', 'PRO', 'ENTERPRISE']).optional(),
  billingCycle: z.enum(['monthly', 'yearly']).optional()
});

/**
 * POST /api/subscriptions/manage
 * 
 * Manage user subscription (upgrade, downgrade, cancel, reactivate)
 * Integrates with Stripe for payment processing
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   action: 'upgrade' | 'downgrade' | 'cancel' | 'reactivate',
 *   plan?: 'FREE' | 'PRO' | 'ENTERPRISE',
 *   billingCycle?: 'monthly' | 'yearly'
 * }
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const validatedData = ManageSubscriptionSchema.parse(body);
    const { action, plan, billingCycle = 'monthly' } = validatedData;

    // Get current subscription
    const currentSubscription = await prisma.subscription.findUnique({
      where: { userId: user.userId },
      include: { user: true }
    });

    if (!currentSubscription) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'SUBSCRIPTION_NOT_FOUND', 
            message: 'No subscription found for user' 
          } 
        },
        { status: 404 }
      );
    }

    let result;

    switch (action) {
      case 'upgrade':
        result = await handleUpgrade(currentSubscription, plan!, billingCycle);
        break;

      case 'downgrade':
        result = await handleDowngrade(currentSubscription, plan!);
        break;

      case 'cancel':
        result = await handleCancellation(currentSubscription);
        break;

      case 'reactivate':
        result = await handleReactivation(currentSubscription);
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: { 
              code: 'INVALID_ACTION', 
              message: 'Invalid subscription action' 
            } 
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Subscription ${action} completed successfully`
    });

  } catch (error: any) {
    console.error('Subscription management error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input data',
            details: (error as any).errors 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'SUBSCRIPTION_ERROR', 
          message: error.message || 'Subscription management failed' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 20,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `subscriptions-manage:${userId}:${ip}`;
  }
})));

/**
 * Handle subscription upgrade
 */
async function handleUpgrade(currentSubscription: any, newPlan: string, billingCycle: string) {
  if (newPlan === 'FREE' || newPlan <= currentSubscription.plan) {
    throw new Error('Cannot upgrade to a lower or same plan');
  }

  // Create Stripe customer if doesn't exist
  let stripeCustomerId = currentSubscription.stripeId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: currentSubscription.user.email,
      name: currentSubscription.user.name,
      metadata: {
        userId: currentSubscription.user.id
      }
    });
    stripeCustomerId = customer.id;
  }

  // Create or update Stripe subscription
  const planConfig = PLAN_PRICES[newPlan as keyof typeof PLAN_PRICES];
  const priceAmount = billingCycle === 'yearly' ? planConfig.yearly : planConfig.monthly;

  let stripeSubscription;
  if (currentSubscription.stripeId && currentSubscription.status === 'ACTIVE') {
    // Update existing subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length > 0) {
      stripeSubscription = await stripe.subscriptions.update(subscriptions.data[0]!.id, {
        items: [{
          id: subscriptions.data[0]!.items.data[0]!.id,
          price_data: {
            currency: 'usd',
            product: `${newPlan} Plan`,
            unit_amount: priceAmount,
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month'
            }
          }
        }],
        proration_behavior: 'always_invoice'
      });
    }
  }

  if (!stripeSubscription) {
    // Create new subscription
    stripeSubscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{
        price_data: {
          currency: 'usd',
          product: `${newPlan} Plan`,
          unit_amount: priceAmount,
          recurring: {
            interval: billingCycle === 'yearly' ? 'year' : 'month'
          }
        }
      }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });
  }

  // Update database
  const updatedSubscription = await prisma.subscription.update({
    where: { userId: currentSubscription.userId },
    data: {
      plan: newPlan as any,
      status: 'ACTIVE',
      stripeId: stripeSubscription.id,
      currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      cancelAtPeriodEnd: false
    }
  });

  // Send upgrade confirmation email
  await sendSimpleEmail({
    to: currentSubscription.user.email,
    subject: `Welcome to ${newPlan} Plan - Omnipreneur AI Suite`,
    html: `
      <h2>Subscription Upgraded!</h2>
      <p>Hi ${currentSubscription.user.name},</p>
      <p>Your subscription has been successfully upgraded to the <strong>${newPlan} Plan</strong>.</p>
      <p><strong>Billing:</strong> $${(priceAmount / 100).toFixed(2)} ${billingCycle}</p>
      <p><strong>Next billing date:</strong> ${new Date((stripeSubscription as any).current_period_end * 1000).toLocaleDateString()}</p>
      <p>You now have access to all premium features. Start exploring your enhanced capabilities!</p>
      <p><a href="${process.env['NEXT_PUBLIC_APP_URL']}/dashboard" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
      <p>Best regards,<br>The Omnipreneur Team</p>
    `
  });

  return {
    subscription: updatedSubscription,
    stripeSubscription: {
      id: stripeSubscription.id,
      clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret
    }
  };
}

/**
 * Handle subscription downgrade
 */
async function handleDowngrade(currentSubscription: any, newPlan: string) {
  if (newPlan >= currentSubscription.plan) {
    throw new Error('Cannot downgrade to a higher or same plan');
  }

  let updatedSubscription;

  if (newPlan === 'FREE') {
    // Cancel Stripe subscription
    if (currentSubscription.stripeId) {
      await stripe.subscriptions.update(currentSubscription.stripeId, {
        cancel_at_period_end: true
      });
    }

    // Update database to show cancellation at period end
    updatedSubscription = await prisma.subscription.update({
      where: { userId: currentSubscription.userId },
      data: {
        cancelAtPeriodEnd: true,
        status: 'ACTIVE' // Still active until period ends
      }
    });

    // Send downgrade notification
    await sendSimpleEmail({
      to: currentSubscription.user.email,
      subject: 'Subscription Downgrade Scheduled',
      html: `
        <h2>Subscription Will Downgrade</h2>
        <p>Hi ${currentSubscription.user.name},</p>
        <p>Your subscription will be downgraded to the FREE plan at the end of your current billing period.</p>
        <p><strong>Access ends:</strong> ${new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</p>
        <p>You'll continue to have full access until that date.</p>
        <p>Change your mind? You can reactivate anytime before then.</p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      `
    });

  } else {
    // Downgrade to a different paid plan
    if (currentSubscription.stripeId) {
      const subscriptions = await stripe.subscriptions.list({
        customer: currentSubscription.stripeId,
        status: 'active',
        limit: 1
      });

      if (subscriptions.data.length > 0) {
        const planConfig = PLAN_PRICES[newPlan as keyof typeof PLAN_PRICES];
        await stripe.subscriptions.update(subscriptions.data[0]!.id, {
          items: [{
            id: subscriptions.data[0]!.items.data[0]!.id,
            price_data: {
              currency: 'usd',
              product: `${newPlan} Plan`,
              unit_amount: planConfig.monthly,
              recurring: { interval: 'month' }
            }
          }],
          proration_behavior: 'always_invoice'
        });
      }
    }

    updatedSubscription = await prisma.subscription.update({
      where: { userId: currentSubscription.userId },
      data: {
        plan: newPlan as any,
        status: 'ACTIVE'
      }
    });
  }

  return { subscription: updatedSubscription };
}

/**
 * Handle subscription cancellation
 */
async function handleCancellation(currentSubscription: any) {
  if (currentSubscription.stripeId) {
    // Cancel Stripe subscription at period end
    await stripe.subscriptions.update(currentSubscription.stripeId, {
      cancel_at_period_end: true
    });
  }

  // Update database
  const updatedSubscription = await prisma.subscription.update({
    where: { userId: currentSubscription.userId },
    data: {
      cancelAtPeriodEnd: true,
      status: 'ACTIVE' // Still active until period ends
    }
  });

  // Send cancellation confirmation
  await sendSimpleEmail({
    to: currentSubscription.user.email,
    subject: 'Subscription Cancelled - We\'ll Miss You!',
    html: `
      <h2>Subscription Cancelled</h2>
      <p>Hi ${currentSubscription.user.name},</p>
      <p>Your subscription has been cancelled as requested.</p>
      <p><strong>Access ends:</strong> ${new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</p>
      <p>You'll continue to have full access until that date.</p>
      <p>We're sorry to see you go! If you change your mind, you can reactivate anytime.</p>
      <p>Best regards,<br>The Omnipreneur Team</p>
    `
  });

  return { subscription: updatedSubscription };
}

/**
 * Handle subscription reactivation
 */
async function handleReactivation(currentSubscription: any) {
  if (!currentSubscription.cancelAtPeriodEnd) {
    throw new Error('Subscription is not scheduled for cancellation');
  }

  if (currentSubscription.stripeId) {
    // Reactivate Stripe subscription
    await stripe.subscriptions.update(currentSubscription.stripeId, {
      cancel_at_period_end: false
    });
  }

  // Update database
  const updatedSubscription = await prisma.subscription.update({
    where: { userId: currentSubscription.userId },
    data: {
      cancelAtPeriodEnd: false,
      status: 'ACTIVE'
    }
  });

  // Send reactivation confirmation
  await sendSimpleEmail({
    to: currentSubscription.user.email,
    subject: 'Subscription Reactivated - Welcome Back!',
    html: `
      <h2>Subscription Reactivated</h2>
      <p>Hi ${currentSubscription.user.name},</p>
      <p>Great news! Your subscription has been reactivated.</p>
      <p>Your ${currentSubscription.plan} plan will continue automatically.</p>
      <p>Welcome back to the Omnipreneur family!</p>
      <p><a href="${process.env['NEXT_PUBLIC_APP_URL']}/dashboard" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
      <p>Best regards,<br>The Omnipreneur Team</p>
    `
  });

  return { subscription: updatedSubscription };
} 