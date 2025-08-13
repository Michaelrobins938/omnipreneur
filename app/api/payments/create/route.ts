// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Stripe from 'stripe';
import { z } from 'zod';
import { withRateLimit } from '@/lib/rate-limit';
import { withCsrfProtection } from '@/lib/security/csrf';

// Using shared Prisma client
const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || '', {
  apiVersion: '2025-06-30.basil',
});

// Product pricing configuration
const PRODUCT_PRICES = {
  // Core Products
  'novus-protocol': { monthly: 4900, yearly: 49000, name: 'NOVUS Protocol' }, // $49/month
  'novus-starter': { monthly: 2900, yearly: 29000, name: 'NOVUS Protocol Starter' }, // $29/month
  'novus-pro': { monthly: 7900, yearly: 79000, name: 'NOVUS Protocol Pro' }, // $79/month
  'bundle-builder': { monthly: 7900, yearly: 79000, name: 'Bundle Builder' }, // $79/month
  'content-spawner': { monthly: 9900, yearly: 99000, name: 'Content Spawner' }, // $99/month
  'auto-rewrite': { monthly: 4900, yearly: 49000, name: 'Auto Rewrite Engine' }, // $49/month
  'affiliate-portal': { monthly: 19900, yearly: 199000, name: 'Affiliate Portal' }, // $199/month
  
  // AI Tools
  'aesthetic-generator': { monthly: 5900, yearly: 59000, name: 'Aesthetic Generator' }, // $59/month
  'live-dashboard': { monthly: 14900, yearly: 149000, name: 'Live Dashboard' }, // $149/month
  'email-marketing-suite': { monthly: 7900, yearly: 79000, name: 'Email Marketing Suite' }, // $79/month
  'seo-optimizer-pro': { monthly: 8900, yearly: 89000, name: 'SEO Optimizer Pro' }, // $89/month
  'social-media-manager': { monthly: 4900, yearly: 49000, name: 'Social Media Manager' }, // $49/month
  'lead-generation-pro': { monthly: 12900, yearly: 129000, name: 'Lead Generation Pro' }, // $129/month
  'project-management-pro': { monthly: 9900, yearly: 99000, name: 'Project Management Pro' }, // $99/month
  'time-tracking-ai': { monthly: 3900, yearly: 39000, name: 'Time Tracking AI' }, // $39/month
  'video-editor-ai': { monthly: 11900, yearly: 119000, name: 'Video Editor AI' }, // $119/month
  'podcast-producer': { monthly: 7900, yearly: 79000, name: 'Podcast Producer' }, // $79/month
  
  // Compliance Tools
  'healthcare-ai-compliance': { monthly: 29900, yearly: 299000, name: 'Healthcare AI Compliance' }, // $299/month
  'financial-ai-compliance': { monthly: 39900, yearly: 399000, name: 'Financial AI Compliance' }, // $399/month
  'legal-ai-compliance': { monthly: 24900, yearly: 249000, name: 'Legal AI Compliance' }, // $249/month
  'education-ai-compliance': { monthly: 9900, yearly: 99000, name: 'Education AI Compliance' }, // $99/month
  'medical-ai-assistant': { monthly: 19900, yearly: 199000, name: 'Medical AI Assistant' }, // $199/month
  
  // Specialized Products
  'quantum-ai-processor': { monthly: 99900, yearly: 999000, name: 'Quantum AI Processor' }, // $999/month
  'ecommerce-optimizer': { monthly: 14900, yearly: 149000, name: 'E-commerce Optimizer' }, // $149/month
  'content-calendar-pro': { monthly: 6900, yearly: 69000, name: 'Content Calendar Pro' }, // $69/month
  'invoice-generator': { monthly: 2900, yearly: 29000, name: 'Invoice Generator' }, // $29/month
  'customer-service-ai': { monthly: 8900, yearly: 89000, name: 'Customer Service AI' }, // $89/month
  'auto-niche-engine': { monthly: 8900, yearly: 89000, name: 'Auto Niche Engine' }, // $89/month
  'prompt-packs': { monthly: 1900, yearly: 19000, name: 'Prompt Packs' }, // $19/month
  
  // Legacy Plans
  PRO: { monthly: 4900, yearly: 49000, name: 'Pro Plan' },
  ENTERPRISE: { monthly: 19900, yearly: 199000, name: 'Enterprise Plan' }
};

// Derived legacy plan prices for GET endpoint usage
const PLAN_PRICES = {
  PRO: PRODUCT_PRICES.PRO,
  ENTERPRISE: PRODUCT_PRICES.ENTERPRISE
};

// Validation schema
const CreatePaymentSchema = z.object({
  productId: z.string().optional(),
  plan: z.enum(['PRO', 'ENTERPRISE']).optional(),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  paymentMethodId: z.string().optional(),
  setupIntent: z.boolean().default(false),
  productName: z.string().optional(),
  price: z.number().optional()
}).refine((data) => {
  // Either productId or plan must be provided
  return data.productId || data.plan;
}, {
  message: "Either productId or plan must be provided"
});

/**
 * POST /api/payments/create
 * 
 * Create payment intent for subscription or one-time payment
 * Integrates with Stripe for secure payment processing
 * 
 * Authentication: Required
 * 
 * Body:
 * {
 *   plan: 'PRO' | 'ENTERPRISE',
 *   billingCycle?: 'monthly' | 'yearly',
 *   paymentMethodId?: string,
 *   setupIntent?: boolean
 * }
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const validatedData = CreatePaymentSchema.parse(body);
    const { productId, plan, billingCycle, paymentMethodId, setupIntent, productName, price } = validatedData;

    // Get user info with subscription
    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { subscription: true }
    });

    if (!userWithSubscription) {
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

    // Determine pricing and product info
    let amount: number;
    let finalProductName: string;
    let finalPlan: string;

    if (productId && PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES]) {
      // Product-specific pricing
      const productConfig = PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES];
      amount = billingCycle === 'yearly' ? productConfig.yearly : productConfig.monthly;
      finalProductName = productName || productConfig.name;
      finalPlan = productId;
    } else if (plan && PRODUCT_PRICES[plan as keyof typeof PRODUCT_PRICES]) {
      // Legacy plan pricing
      const planConfig = PRODUCT_PRICES[plan as keyof typeof PRODUCT_PRICES];
      amount = billingCycle === 'yearly' ? planConfig.yearly : planConfig.monthly;
      finalProductName = productName || planConfig.name;
      finalPlan = plan;
    } else if (price) {
      // Custom pricing
      amount = price * 100; // Convert to cents
      finalProductName = productName || 'Custom Product';
      finalPlan = productId || 'CUSTOM';
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_PRODUCT', 
            message: 'Invalid product or pricing configuration' 
          } 
        },
        { status: 400 }
      );
    }

    // Check if user already has this product (optional - you might want to allow multiple subscriptions)
    // const currentPlan = userWithSubscription.subscription?.plan || 'FREE';
    // if (shouldBlockPayment(currentPlan, finalPlan)) {
    //   return NextResponse.json(
    //     { 
    //       success: false, 
    //       error: { 
    //         code: 'INVALID_UPGRADE', 
    //         message: `Cannot downgrade from ${currentPlan} to ${finalPlan}` 
    //       } 
    //     },
    //     { status: 400 }
    //   );
    // }

    // Create or get Stripe customer
    let customerId = userWithSubscription.subscription?.stripeId;
    if (!customerId || !customerId.startsWith('cus_')) {
      const customer = await stripe.customers.create({
        email: userWithSubscription.email,
        name: userWithSubscription.name,
        metadata: {
          userId: user.userId
        }
      });
      customerId = customer.id;
      
      // Update subscription with customer ID
      if (userWithSubscription.subscription) {
        await prisma.subscription.update({
          where: { userId: user.userId },
          data: { stripeId: customerId }
        });
      }
    }

    let result;

    if (setupIntent) {
      // Create setup intent for saving payment method
      const setupIntentResult = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session',
        metadata: {
          userId: user.userId,
          plan: finalPlan,
          billingCycle: billingCycle,
          productId: productId || finalPlan,
          productName: finalProductName
        }
      });

      result = {
        setupIntent: {
          id: setupIntentResult.id,
          clientSecret: setupIntentResult.client_secret
        },
        type: 'setup_intent'
      };

    } else if (paymentMethodId) {
      // Create payment intent with existing payment method
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: customerId,
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
        return_url: `${process.env['NEXT_PUBLIC_APP_URL']}/payment/success?payment_intent={PAYMENT_INTENT_ID}`,
        metadata: {
          userId: user.userId,
          plan: finalPlan,
          billingCycle: billingCycle,
          productId: productId || finalPlan,
          productName: finalProductName
        }
      });

      // Save payment record
      const payment = await prisma.payment.create({
        data: {
          userId: user.userId,
          stripeId: paymentIntent.id,
          amount: amount / 100, // Convert from cents
          currency: 'usd',
          status: mapPaymentStatus(paymentIntent.status),
          plan: finalPlan,
          productName: `${finalProductName} - ${billingCycle}`,
          metadata: {
            billingCycle,
            paymentMethodId
          }
        }
      });

      result = {
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          clientSecret: paymentIntent.client_secret
        },
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount
        },
        type: 'payment_intent'
      };

    } else {
      // Create payment intent without payment method (for client-side completion)
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: customerId,
        automatic_payment_methods: {
          enabled: true
        },
        metadata: {
          userId: user.userId,
          plan: finalPlan,
          billingCycle: billingCycle,
          productId: productId || finalPlan,
          productName: finalProductName
        }
      });

      // Save payment record as pending
      const payment = await prisma.payment.create({
        data: {
          userId: user.userId,
          stripeId: paymentIntent.id,
          amount: amount / 100,
          currency: 'usd',
          status: 'PENDING',
          plan: finalPlan,
          productName: `${finalProductName} - ${billingCycle}`,
          metadata: { billingCycle }
        }
      });

      result = {
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret
        },
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount
        },
        type: 'payment_intent'
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        plan: finalPlan,
        productId: productId || finalPlan,
        productName: finalProductName,
        billingCycle: billingCycle,
        amount: amount / 100,
        currency: 'usd'
      }
    });

  } catch (error: any) {
    console.error('Payment creation error:', error);

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

    if (error.type === 'StripeCardError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'CARD_ERROR', 
            message: error.message 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'PAYMENT_ERROR', 
          message: error.message || 'Payment creation failed' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 30, // 30 payment attempts per 10 minutes per user
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `payments-create:${userId}:${ip}`;
  }
})));

/**
 * GET /api/payments/create
 * 
 * Get payment methods and customer information
 */
export const GET = requireAuth(withRateLimit(async (request: NextRequest) => {
  try {
    const user = (request as any).user;

    const userWithSubscription = await prisma.user.findUnique({
      where: { id: user.userId },
      include: { 
        subscription: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!userWithSubscription) {
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

    let paymentMethods: any[] = [];
    let customer = null;

    // Get Stripe customer and payment methods if exists
    if (userWithSubscription.subscription?.stripeId?.startsWith('cus_')) {
      try {
        customer = await stripe.customers.retrieve(userWithSubscription.subscription.stripeId);
        const methods = await stripe.paymentMethods.list({
          customer: userWithSubscription.subscription.stripeId,
          type: 'card'
        });
        paymentMethods = methods.data.map(pm => ({
          id: pm.id,
          type: pm.type,
          card: pm.card ? {
            brand: pm.card.brand,
            last4: pm.card.last4,
            expMonth: pm.card.exp_month,
            expYear: pm.card.exp_year
          } : null
        }));
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userWithSubscription.id,
          email: userWithSubscription.email,
          name: userWithSubscription.name
        },
        subscription: userWithSubscription.subscription,
        paymentMethods,
        recentPayments: userWithSubscription.payments,
        plans: {
          PRO: {
            name: 'Pro Plan',
            monthlyPrice: PLAN_PRICES.PRO.monthly / 100,
            yearlyPrice: PLAN_PRICES.PRO.yearly / 100,
            features: [
              'Up to 500 content pieces per month',
              'Advanced AI optimization',
              'Bundle builder',
              'Basic analytics',
              'Email support'
            ]
          },
          ENTERPRISE: {
            name: 'Enterprise Plan',
            monthlyPrice: PLAN_PRICES.ENTERPRISE.monthly / 100,
            yearlyPrice: PLAN_PRICES.ENTERPRISE.yearly / 100,
            features: [
              'Unlimited content generation',
              'Custom AI models',
              'Advanced analytics',
              'White-label options',
              'Priority support',
              'Custom integrations'
            ]
          }
        }
      }
    });

  } catch (error: any) {
    console.error('Get payment info error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'FETCH_ERROR', 
          message: 'Failed to fetch payment information' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 60,
  windowMs: 5 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `payments-get:${userId}:${ip}`;
  }
}));

/**
 * Check if payment should be blocked (can't downgrade)
 */
function shouldBlockPayment(currentPlan: string, targetPlan: string): boolean {
  const planHierarchy = { FREE: 0, PRO: 1, ENTERPRISE: 2 };
  return planHierarchy[targetPlan as keyof typeof planHierarchy] <= 
         planHierarchy[currentPlan as keyof typeof planHierarchy];
}

/**
 * Map Stripe payment status to our database enum
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
    case 'payment_failed':
    default:
      return 'FAILED';
  }
} 