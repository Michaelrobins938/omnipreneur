// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { handleSubscriptionCommission, handleSubscriptionRefund, handleRecurringCommission } from '@/lib/affiliate-commission-handler';
import prisma from '@/lib/db';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET']!;

/**
 * POST /api/webhooks/subscription
 * 
 * Handle Stripe subscription webhooks for affiliate commission tracking
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Processing webhook event: ${event.type}`);

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object as Stripe.Dispute);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Find user by Stripe customer ID
    const user = await prisma.user.findFirst({
      where: {
        subscription: {
          stripeId: customerId
        }
      },
      select: {
        id: true,
        referredBy: true,
        referralSource: true
      }
    });

    if (!user) {
      console.warn(`User not found for customer ID: ${customerId}`);
      return;
    }

    // Calculate subscription amount (in dollars)
    const amount = subscription.items.data.reduce((total, item) => {
      return total + (item.price.unit_amount || 0);
    }, 0) / 100;

    // Get plan name from price metadata or ID
    const priceId = subscription.items.data[0]?.price.id;
    const planName = getPlanNameFromPriceId(priceId || '') || 'Unknown Plan';

    const subscriptionData = {
      plan: planName,
      amount,
      subscriptionId: subscription.id,
      isUpgrade: false
    };

    // Handle affiliate commission
    const commission = await handleSubscriptionCommission(user.id, subscriptionData);
    
    if (commission) {
      console.log(`Created commission ${commission.commissionId} for affiliate ${commission.affiliateId}, amount: $${commission.amount}`);
    }

    // Update subscription record
    await prisma.subscription.updateMany({
      where: { stripeId: customerId },
      data: {
        status: 'ACTIVE',
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
      }
    });

  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    const user = await prisma.user.findFirst({
      where: {
        subscription: {
          stripeId: customerId
        }
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true
          }
        }
      }
    });

    if (!user) return;

    // Check if this is an upgrade (price increase)
    const newAmount = subscription.items.data.reduce((total, item) => {
      return total + (item.price.unit_amount || 0);
    }, 0) / 100;

    const priceId = subscription.items.data[0]?.price.id;
    const newPlanName = getPlanNameFromPriceId(priceId || '') || 'Unknown Plan';
    const previousPlan = user.subscription?.plan || 'FREE';

    // Only track commission if it's an upgrade to a higher tier
    const isUpgrade = isUpgradeTransaction(previousPlan, newPlanName);

    if (isUpgrade) {
      const subscriptionData = {
        plan: newPlanName,
        amount: newAmount,
        subscriptionId: subscription.id,
        isUpgrade: true,
        previousPlan
      };

      const commission = await handleSubscriptionCommission(user.id, subscriptionData);
      
      if (commission) {
        console.log(`Created upgrade commission ${commission.commissionId} for affiliate ${commission.affiliateId}`);
      }
    }

    // Update subscription status
    const status = subscription.status === 'active' ? 'ACTIVE' : 
                   subscription.status === 'canceled' ? 'CANCELLED' :
                   subscription.status === 'past_due' ? 'PAST_DUE' : 'ACTIVE';

    await prisma.subscription.updateMany({
      where: { stripeId: customerId },
      data: {
        status,
        plan: mapStripePlanToEnum(newPlanName),
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });

  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    const user = await prisma.user.findFirst({
      where: {
        subscription: {
          stripeId: customerId
        }
      },
      select: { id: true }
    });

    if (!user) return;

    // Handle commission cancellation if cancelled within refund period
    const subscriptionAge = Date.now() - (subscription.created * 1000);
    const refundPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days

    if (subscriptionAge <= refundPeriod) {
      await handleSubscriptionRefund(user.id, subscription.id, 'cancellation');
    }

    // Update subscription status
    await prisma.subscription.updateMany({
      where: { stripeId: customerId },
      data: {
        status: 'CANCELLED'
      }
    });

  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Handle recurring payments for affiliate commissions
    if ((invoice as any).subscription && invoice.billing_reason === 'subscription_cycle') {
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
      const customerId = subscription.customer as string;
      
      const user = await prisma.user.findFirst({
        where: {
          subscription: {
            stripeId: customerId
          }
        },
        select: { id: true }
      });

      if (!user) return;

      const amount = (invoice.amount_paid || 0) / 100;
      const billingPeriod = {
        start: new Date(invoice.period_start * 1000),
        end: new Date(invoice.period_end * 1000)
      };

      // Create recurring commission
      const recurringCommission = await handleRecurringCommission(
        subscription.id,
        billingPeriod,
        amount
      );

      if (recurringCommission) {
        console.log(`Created recurring commission for month ${recurringCommission.month}, amount: $${recurringCommission.amount}`);
      }
    }

  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    // Update subscription status to past due
    if ((invoice as any).subscription) {
      const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
      const customerId = subscription.customer as string;

      await prisma.subscription.updateMany({
        where: { stripeId: customerId },
        data: { status: 'PAST_DUE' }
      });
    }

  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

async function handleChargeDispute(dispute: Stripe.Dispute) {
  try {
    // Handle chargeback - cancel related commissions
    const charge = dispute.charge as string;
    
    // Find invoice associated with this charge
    const charges = await stripe.charges.list({ limit: 1 });
    const chargeObj = charges.data.find(c => c.id === charge);
    
    if ((chargeObj as any)?.invoice) {
      const invoice = await stripe.invoices.retrieve((chargeObj as any).invoice as string);
      
      if ((invoice as any).subscription) {
        const subscription = await stripe.subscriptions.retrieve((invoice as any).subscription as string);
        const customerId = subscription.customer as string;
        
        const user = await prisma.user.findFirst({
          where: {
            subscription: {
              stripeId: customerId
            }
          },
          select: { id: true }
        });

        if (user) {
          await handleSubscriptionRefund(user.id, subscription.id, 'chargeback');
        }
      }
    }

  } catch (error) {
    console.error('Error handling charge dispute:', error);
  }
}

// Helper functions
function getPlanNameFromPriceId(priceId: string): string {
  // Map Stripe price IDs to plan names
  const priceMapping: Record<string, string> = {
    // Add your actual Stripe price IDs here
    'price_novus_monthly': 'NOVUS Protocol',
    'price_pro_monthly': 'PRO',
    'price_enterprise_monthly': 'ENTERPRISE',
    'price_bundle_builder_monthly': 'Bundle Builder',
    'price_content_spawner_monthly': 'Content Spawner',
    'price_auto_rewrite_monthly': 'Auto Rewrite Engine',
    'price_affiliate_portal_monthly': 'Affiliate Portal'
  };

  return priceMapping[priceId] || 'Custom Plan';
}

function isUpgradeTransaction(previousPlan: string, newPlan: string): boolean {
  const planHierarchy = {
    'FREE': 0,
    'NOVUS_PROTOCOL': 1,
    'AUTO_REWRITE': 1,
    'BUNDLE_BUILDER': 2,
    'CONTENT_SPAWNER': 2,
    'PRO': 3,
    'ENTERPRISE': 4
  };

  const previousLevel = planHierarchy[previousPlan as keyof typeof planHierarchy] || 0;
  const newLevel = planHierarchy[newPlan as keyof typeof planHierarchy] || 0;

  return newLevel > previousLevel;
}

function mapStripePlanToEnum(planName: string): string {
  const mapping: Record<string, string> = {
    'NOVUS Protocol': 'PRO',
    'PRO': 'PRO',
    'ENTERPRISE': 'ENTERPRISE',
    'Bundle Builder': 'PRO',
    'Content Spawner': 'PRO',
    'Auto Rewrite Engine': 'PRO',
    'Affiliate Portal': 'ENTERPRISE'
  };

  return mapping[planName] || 'PRO';
}