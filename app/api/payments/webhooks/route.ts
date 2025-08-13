// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';
import { sendSimpleEmail } from '@/lib/email';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env['STRIPE_WEBHOOK_SECRET']!;

/**
 * POST /api/payments/webhooks
 * 
 * Handles Stripe webhook events for payment processing
 * 
 * Supported Events:
 * - payment_intent.succeeded: Payment completed successfully
 * - payment_intent.payment_failed: Payment failed
 * - customer.subscription.created: New subscription created
 * - customer.subscription.updated: Subscription modified
 * - customer.subscription.deleted: Subscription cancelled
 * - invoice.payment_succeeded: Recurring payment succeeded
 * - invoice.payment_failed: Recurring payment failed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_SIGNATURE', message: 'Missing signature' } },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_SIGNATURE', message: 'Invalid signature' } },
        { status: 400 }
      );
    }

    console.log('Processing Stripe webhook:', event.type, event.id);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true, received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'WEBHOOK_ERROR', 
          message: 'Failed to process webhook' 
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment record in database
    await prisma.payment.update({
      where: { stripeId: paymentIntent.id },
      data: { 
        status: 'SUCCEEDED',
        metadata: paymentIntent.metadata
      }
    });

    // Get user information
    const payment = await prisma.payment.findUnique({
      where: { stripeId: paymentIntent.id },
      include: { user: true }
    });

    if (payment) {
      // Send confirmation email
      await sendSimpleEmail({
        to: payment.user.email,
        subject: 'Payment Confirmation - Omnipreneur AI Suite',
        html: `
          <h2>Payment Confirmed!</h2>
          <p>Hi ${payment.user.name},</p>
          <p>Your payment of $${(payment.amount / 100).toFixed(2)} has been processed successfully.</p>
          <p>Transaction ID: ${payment.stripeId}</p>
          <p>Thank you for choosing Omnipreneur AI Suite!</p>
          <p>Best regards,<br>The Omnipreneur Team</p>
        `
      });

      console.log(`Payment succeeded for user ${payment.user.email}: $${payment.amount / 100}`);
    }

  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    // Update payment record
    await prisma.payment.update({
      where: { stripeId: paymentIntent.id },
      data: { 
        status: 'FAILED',
        metadata: {
          ...paymentIntent.metadata,
          failureReason: paymentIntent.last_payment_error?.message
        }
      }
    });

    // Get user information
    const payment = await prisma.payment.findUnique({
      where: { stripeId: paymentIntent.id },
      include: { user: true }
    });

    if (payment) {
      // Send failure notification
      await sendSimpleEmail({
        to: payment.user.email,
        subject: 'Payment Failed - Omnipreneur AI Suite',
        html: `
          <h2>Payment Failed</h2>
          <p>Hi ${payment.user.name},</p>
          <p>We were unable to process your payment of $${(payment.amount / 100).toFixed(2)}.</p>
          <p>Reason: ${paymentIntent.last_payment_error?.message || 'Unknown error'}</p>
          <p>Please try again or contact support if the issue persists.</p>
          <p>Best regards,<br>The Omnipreneur Team</p>
        `
      });

      console.log(`Payment failed for user ${payment.user.email}: ${paymentIntent.last_payment_error?.message}`);
    }

  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

/**
 * Handle new subscription creation
 */
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
      include: { subscription: true }
    });

    if (user && user.subscription) {
      // Update subscription with Stripe details
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          stripeId: subscription.id,
          status: mapStripeStatus(subscription.status),
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });

      console.log(`Subscription created for user ${user.email}: ${subscription.id}`);
    }

  } catch (error) {
    console.error('Error handling subscription creation:', error);
    throw error;
  }
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    // Find subscription by Stripe ID
    const existingSubscription = await prisma.subscription.findUnique({
      where: { stripeId: subscription.id },
      include: { user: true }
    });

    if (existingSubscription) {
      // Update subscription status and details
      await prisma.subscription.update({
        where: { stripeId: subscription.id },
        data: {
          status: mapStripeStatus(subscription.status),
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });

      // If subscription was cancelled, send notification
      if (subscription.cancel_at_period_end) {
        await sendSimpleEmail({
          to: existingSubscription.user.email,
          subject: 'Subscription Cancelled - Omnipreneur AI Suite',
          html: `
            <h2>Subscription Cancelled</h2>
            <p>Hi ${existingSubscription.user.name},</p>
            <p>Your subscription has been cancelled and will end on ${new Date((subscription as any).current_period_end * 1000).toLocaleDateString()}.</p>
            <p>You'll continue to have access to all premium features until that date.</p>
            <p>We're sorry to see you go! If you change your mind, you can reactivate anytime.</p>
            <p>Best regards,<br>The Omnipreneur Team</p>
          `
        });
      }

      console.log(`Subscription updated for user ${existingSubscription.user.email}: ${subscription.status}`);
    }

  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

/**
 * Handle subscription deletion/cancellation
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    // Update subscription status to cancelled
    const updatedSubscription = await prisma.subscription.update({
      where: { stripeId: subscription.id },
      data: {
        status: 'CANCELLED',
        plan: 'FREE' // Downgrade to free plan
      },
      include: { user: true }
    });

    // Send cancellation confirmation
    await sendSimpleEmail({
      to: updatedSubscription.user.email,
      subject: 'Subscription Ended - Omnipreneur AI Suite',
      html: `
        <h2>Subscription Ended</h2>
        <p>Hi ${updatedSubscription.user.name},</p>
        <p>Your subscription has ended and your account has been moved to the free plan.</p>
        <p>You can upgrade anytime to regain access to premium features.</p>
        <p>Thank you for being part of the Omnipreneur community!</p>
        <p>Best regards,<br>The Omnipreneur Team</p>
      `
    });

    console.log(`Subscription deleted for user ${updatedSubscription.user.email}`);

  } catch (error) {
    console.error('Error handling subscription deletion:', error);
    throw error;
  }
}

/**
 * Handle successful invoice payment (recurring)
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    // Create payment record for recurring payment
    const subscriptionId = (invoice as any).subscription as string;
    
    const subscription = await prisma.subscription.findUnique({
      where: { stripeId: subscriptionId },
      include: { user: true }
    });

    if (subscription) {
      // Create payment record
      await prisma.payment.create({
        data: {
          userId: subscription.user.id,
          stripeId: (invoice as any).payment_intent as string,
          amount: invoice.amount_paid / 100, // Convert from cents
          currency: invoice.currency,
          status: 'SUCCEEDED',
          plan: subscription.plan,
          productName: `${subscription.plan} Plan - Monthly`,
          metadata: {
            invoiceId: invoice.id,
            subscriptionId: subscriptionId,
            billingReason: invoice.billing_reason
          }
        }
      });

      // Create invoice record
      await prisma.invoice.create({
        data: {
          userId: subscription.user.id,
          stripeId: invoice.id!,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: 'PAID',
          paidAt: new Date()
        }
      });

      // Send receipt email
      await sendSimpleEmail({
        to: subscription.user.email,
        subject: 'Payment Receipt - Omnipreneur AI Suite',
        html: `
          <h2>Payment Receipt</h2>
          <p>Hi ${subscription.user.name},</p>
          <p>Thank you for your continued subscription!</p>
          <p><strong>Amount:</strong> $${(invoice.amount_paid / 100).toFixed(2)}</p>
          <p><strong>Plan:</strong> ${subscription.plan}</p>
          <p><strong>Next billing date:</strong> ${new Date(subscription.currentPeriodEnd!).toLocaleDateString()}</p>
          <p><strong>Invoice ID:</strong> ${invoice.number}</p>
          <p>Best regards,<br>The Omnipreneur Team</p>
        `
      });

      console.log(`Recurring payment succeeded for user ${subscription.user.email}: $${invoice.amount_paid / 100}`);
    }

  } catch (error) {
    console.error('Error handling invoice payment success:', error);
    throw error;
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const subscriptionId = (invoice as any).subscription as string;
    
    const subscription = await prisma.subscription.findUnique({
      where: { stripeId: subscriptionId },
      include: { user: true }
    });

    if (subscription) {
      // Update subscription status to past due
      await prisma.subscription.update({
        where: { stripeId: subscriptionId },
        data: { status: 'PAST_DUE' }
      });

      // Send payment failure notification
      await sendSimpleEmail({
        to: subscription.user.email,
        subject: 'Payment Failed - Action Required',
        html: `
          <h2>Payment Failed</h2>
          <p>Hi ${subscription.user.name},</p>
          <p>We were unable to process your subscription payment of $${(invoice.amount_due / 100).toFixed(2)}.</p>
          <p>Please update your payment method to continue enjoying premium features.</p>
          <p>Your account will be suspended if payment is not received within 7 days.</p>
          <p><a href="${process.env['NEXT_PUBLIC_APP_URL']}/dashboard/billing" style="background: #0066cc; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Update Payment Method</a></p>
          <p>Best regards,<br>The Omnipreneur Team</p>
        `
      });

      console.log(`Recurring payment failed for user ${subscription.user.email}`);
    }

  } catch (error) {
    console.error('Error handling invoice payment failure:', error);
    throw error;
  }
}

/**
 * Handle completed checkout session
 * This is called when a customer completes checkout, whether they're a new or existing user
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { metadata } = session;
    const customerEmail = session.customer_details?.email;
    const productId = metadata?.['productId'];
    const productName = metadata?.['productName'];
    const billingCycle = metadata?.['billingCycle'];
    
    if (!customerEmail || !productId || !productName) {
      console.error('Missing required data in checkout session:', { customerEmail, productId, productName });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: customerEmail }
    });

    const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';
    
    if (existingUser) {
      // Grant/ensure entitlement for this product
      await prisma.entitlement.upsert({
        where: { userId_productId: { userId: existingUser.id, productId } },
        update: { status: 'ACTIVE' },
        create: { userId: existingUser.id, productId, status: 'ACTIVE' }
      });

      // Existing user - send login link to access product
      await sendSimpleEmail({
        to: customerEmail,
        subject: `Welcome to ${productName} - Access Your Product Now!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">🎉 Purchase Confirmed!</h1>
            
            <p>Hi there!</p>
            
            <p>Thank you for purchasing <strong>${productName}</strong>! Your subscription is now active.</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="color: white; margin: 0;">Ready to get started?</h2>
              <p style="color: white; margin: 10px 0;">Click below to access your product dashboard</p>
              <a href="${baseUrl}/auth/login?redirect=/dashboard&highlight=${productId}" 
                 style="display: inline-block; background: white; color: #2563eb; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; margin: 10px;">
                Access ${productName} →
              </a>
            </div>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">Your Subscription Details:</h3>
              <ul style="color: #374151;">
                <li><strong>Product:</strong> ${productName}</li>
                <li><strong>Billing:</strong> ${billingCycle}</li>
                <li><strong>Session ID:</strong> ${session.id}</li>
                <li><strong>Next steps:</strong> Log in to start using your AI tools!</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              Questions? Reply to this email or visit our <a href="${baseUrl}/support">support center</a>.
            </p>
            
            <p style="text-align: center;">
              Best regards,<br>
              <strong>The Omnipreneur Team</strong>
            </p>
          </div>
        `
      });
    } else {
      // New user - send signup link with pre-filled product info
      const signupToken = Buffer.from(JSON.stringify({
        email: customerEmail,
        productId,
        productName,
        sessionId: session.id,
        timestamp: Date.now()
      })).toString('base64url');

      await sendSimpleEmail({
        to: customerEmail,
        subject: `Welcome to ${productName} - Complete Your Account Setup`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2563eb; text-align: center;">🚀 Welcome to Omnipreneur AI!</h1>
            
            <p>Hi there!</p>
            
            <p>Thank you for purchasing <strong>${productName}</strong>! Your payment has been processed successfully.</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
              <h2 style="color: white; margin: 0;">Complete Your Account Setup</h2>
              <p style="color: white; margin: 10px 0;">Create your account to access ${productName} and all its powerful AI features</p>
              <a href="${baseUrl}/auth/register?token=${signupToken}" 
                 style="display: inline-block; background: white; color: #2563eb; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; margin: 10px;">
                Create My Account →
              </a>
            </div>
            
            <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
              <ol style="color: #374151;">
                <li>Click the button above to create your account (takes 30 seconds)</li>
                <li>Access your personalized AI dashboard</li>
                <li>Start using ${productName} immediately</li>
                <li>Explore all the powerful features included in your subscription</li>
              </ol>
            </div>
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0;">Your Purchase Details:</h3>
              <ul style="color: #374151;">
                <li><strong>Product:</strong> ${productName}</li>
                <li><strong>Billing:</strong> ${billingCycle}</li>
                <li><strong>Session ID:</strong> ${session.id}</li>
                <li><strong>Email:</strong> ${customerEmail}</li>
              </ul>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 30px;">
              This link will expire in 24 hours for security. Questions? Reply to this email or visit our <a href="${baseUrl}/support">support center</a>.
            </p>
            
            <p style="text-align: center;">
              Best regards,<br>
              <strong>The Omnipreneur Team</strong>
            </p>
          </div>
        `
      });
    }

    console.log(`Checkout completed for ${customerEmail}: ${productName} (${session.id})`);

  } catch (error) {
    console.error('Error handling checkout completion:', error);
    throw error;
  }
}

/**
 * Map Stripe subscription status to our database enum
 */
function mapStripeStatus(stripeStatus: string): 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'UNPAID' | 'TRIAL' {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'canceled':
    case 'cancelled':
      return 'CANCELLED';
    case 'past_due':
      return 'PAST_DUE';
    case 'unpaid':
      return 'UNPAID';
    case 'trialing':
      return 'TRIAL';
    default:
      return 'ACTIVE';
  }
}