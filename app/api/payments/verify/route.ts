import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || '', {
  apiVersion: '2023-10-16',
});

const getHandler = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const paymentIntentId = searchParams.get('payment_intent');

    if (!sessionId && !paymentIntentId) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'MISSING_PARAMETERS', 
            message: 'Either session_id or payment_intent is required' 
          } 
        },
        { status: 400 }
      );
    }

    let paymentData;

    if (sessionId) {
      paymentData = await verifyCheckoutSession(sessionId);
    } else if (paymentIntentId) {
      paymentData = await verifyPaymentIntent(paymentIntentId);
    }

    if (!paymentData) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'PAYMENT_NOT_FOUND', 
            message: 'Payment verification failed or payment not found' 
          } 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      payment: paymentData
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'VERIFICATION_ERROR', 
          message: 'Failed to verify payment' 
        } 
      },
      { status: 500 }
    );
  }
};

export const GET = requireAuth(withRateLimit(withCsrfProtection(getHandler as any), {
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 requests per minute per user
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId;
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    return `payment-verify:${userId}:${ip}`;
  }
}));

/**
 * Verify Stripe checkout session and return payment data
 */
async function verifyCheckoutSession(sessionId: string) {
  try {
    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription']
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Get payment intent details
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    
    if (!paymentIntent) {
      throw new Error('No payment intent found in session');
    }

    // Find corresponding payment in database
    const payment = await prisma.payment.findUnique({
      where: { stripeId: paymentIntent.id },
      include: { user: true }
    });

    if (!payment) {
      // Create payment record if it doesn't exist (backup)
      const newPayment = await prisma.payment.create({
        data: {
          userId: session.metadata?.userId || '',
          stripeId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: mapPaymentStatus(paymentIntent.status),
          plan: session.metadata?.plan as any || 'PRO',
          productName: session.metadata?.productName || 'Unknown Product',
          metadata: {
            sessionId,
            billingCycle: session.metadata?.billingCycle,
            productId: session.metadata?.productId
          }
        },
        include: { user: true }
      });
      
      return formatPaymentData(newPayment, session);
    }

    return formatPaymentData(payment, session);

  } catch (error) {
    console.error('Error verifying checkout session:', error);
    return null;
  }
}

/**
 * Verify payment intent and return payment data
 */
async function verifyPaymentIntent(paymentIntentId: string) {
  try {
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      throw new Error('Payment intent not found');
    }

    // Find corresponding payment in database
    const payment = await prisma.payment.findUnique({
      where: { stripeId: paymentIntentId },
      include: { user: true }
    });

    if (!payment) {
      throw new Error('Payment record not found in database');
    }

    return formatPaymentData(payment, null, paymentIntent);

  } catch (error) {
    console.error('Error verifying payment intent:', error);
    return null;
  }
}

/**
 * Format payment data for API response
 */
function formatPaymentData(payment: any, session?: Stripe.Checkout.Session | null, paymentIntent?: Stripe.PaymentIntent) {
  return {
    id: payment.stripeId,
    amount: payment.amount * 100, // Convert back to cents for display
    currency: payment.currency,
    status: payment.status,
    productName: payment.productName,
    plan: payment.plan,
    billingCycle: payment.metadata?.billingCycle || 'monthly',
    customerEmail: payment.user.email,
    customerName: payment.user.name,
    timestamp: payment.createdAt.toISOString(),
    sessionId: session?.id || payment.metadata?.sessionId,
    paymentIntentId: paymentIntent?.id || payment.stripeId,
    metadata: payment.metadata
  };
}

/**
 * Map Stripe payment status to our enum
 */
function mapPaymentStatus(stripeStatus: string): 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' {
  switch (stripeStatus) {
    case 'succeeded':
      return 'SUCCEEDED';
    case 'processing':
    case 'requires_payment_method':
    case 'requires_confirmation':
    case 'requires_action':
      return 'PENDING';
    case 'canceled':
      return 'CANCELLED';
    default:
      return 'FAILED';
  }
}