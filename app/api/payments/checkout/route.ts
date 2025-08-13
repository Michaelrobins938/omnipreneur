// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Stripe from 'stripe';
import { z } from 'zod';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY'] || '', {
  apiVersion: '2025-06-30.basil',
});

// Product pricing configuration (same as payments/create)
const PRODUCT_PRICES = {
  // Core Products
  'novus-protocol': { monthly: 4900, yearly: 49000, name: 'NOVUS Protocol' },
  'novus-starter': { monthly: 2900, yearly: 29000, name: 'NOVUS Protocol Starter' },
  'novus-pro': { monthly: 7900, yearly: 79000, name: 'NOVUS Protocol Pro' },
  'bundle-builder': { monthly: 7900, yearly: 79000, name: 'Bundle Builder' },
  'content-spawner': { monthly: 9900, yearly: 99000, name: 'Content Spawner' },
  'auto-rewrite': { monthly: 4900, yearly: 49000, name: 'Auto Rewrite Engine' },
  'affiliate-portal': { monthly: 19900, yearly: 199000, name: 'Affiliate Portal' },
  
  // AI Tools
  'aesthetic-generator': { monthly: 5900, yearly: 59000, name: 'Aesthetic Generator' },
  'live-dashboard': { monthly: 14900, yearly: 149000, name: 'Live Dashboard' },
  'email-marketing-suite': { monthly: 7900, yearly: 79000, name: 'Email Marketing Suite' },
  'seo-optimizer-pro': { monthly: 8900, yearly: 89000, name: 'SEO Optimizer Pro' },
  'social-media-manager': { monthly: 4900, yearly: 49000, name: 'Social Media Manager' },
  'lead-generation-pro': { monthly: 12900, yearly: 129000, name: 'Lead Generation Pro' },
  'project-management-pro': { monthly: 9900, yearly: 99000, name: 'Project Management Pro' },
  'time-tracking-ai': { monthly: 3900, yearly: 39000, name: 'Time Tracking AI' },
  'video-editor-ai': { monthly: 11900, yearly: 119000, name: 'Video Editor AI' },
  'podcast-producer': { monthly: 7900, yearly: 79000, name: 'Podcast Producer' },
  
  // Compliance Tools
  'healthcare-ai-compliance': { monthly: 29900, yearly: 299000, name: 'Healthcare AI Compliance' },
  'financial-ai-compliance': { monthly: 39900, yearly: 399000, name: 'Financial AI Compliance' },
  'legal-ai-compliance': { monthly: 24900, yearly: 249000, name: 'Legal AI Compliance' },
  'education-ai-compliance': { monthly: 9900, yearly: 99000, name: 'Education AI Compliance' },
  'medical-ai-assistant': { monthly: 19900, yearly: 199000, name: 'Medical AI Assistant' },
  
  // Specialized Products
  'quantum-ai-processor': { monthly: 99900, yearly: 999000, name: 'Quantum AI Processor' },
  'ecommerce-optimizer': { monthly: 14900, yearly: 149000, name: 'E-commerce Optimizer' },
  'content-calendar-pro': { monthly: 6900, yearly: 69000, name: 'Content Calendar Pro' },
  'invoice-generator': { monthly: 2900, yearly: 29000, name: 'Invoice Generator' },
  'customer-service-ai': { monthly: 8900, yearly: 89000, name: 'Customer Service AI' },
  'auto-niche-engine': { monthly: 8900, yearly: 89000, name: 'Auto Niche Engine' },
  'prompt-packs': { monthly: 1900, yearly: 19000, name: 'Prompt Packs' }
};

const CheckoutSchema = z.object({
  productId: z.string(),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly')
});

/**
 * POST /api/payments/checkout
 * 
 * Create Stripe checkout session for product subscription
 * Returns checkout URL for redirection
 */
export const POST = requireAuth(withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    // Validate input
    const { productId, billingCycle } = CheckoutSchema.parse(body);
    
    // Get product configuration
    const productConfig = PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES];
    if (!productConfig) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_PRODUCT', 
            message: 'Product not found' 
          } 
        },
        { status: 404 }
      );
    }

    const amount = billingCycle === 'yearly' ? productConfig.yearly : productConfig.monthly;
    const baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productConfig.name,
              description: `${productConfig.name} - ${billingCycle} subscription`,
              images: [`${baseUrl}/api/og?product=${productId}`], // Optional: Add product images
            },
            unit_amount: amount,
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&product=${productId}&plan=${billingCycle}`,
      cancel_url: `${baseUrl}/payment/cancelled?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}&product_name=${encodeURIComponent(productConfig.name)}&amount=${amount}&reason=user_cancelled`,
      metadata: {
        userId: user.userId,
        productId: productId,
        billingCycle: billingCycle,
        productName: productConfig.name
      },
      subscription_data: {
        metadata: {
          userId: user.userId,
          productId: productId,
          billingCycle: billingCycle,
          productName: productConfig.name
        }
      },
      customer_email: user.email, // Pre-fill email if available
      allow_promotion_codes: true, // Allow discount codes
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true // For business customers
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
        productId: productId,
        productName: productConfig.name,
        amount: amount / 100,
        billingCycle: billingCycle
      }
    });

  } catch (error: any) {
    console.error('Checkout creation error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'CHECKOUT_ERROR', 
          message: 'Failed to create checkout session' 
        } 
      },
      { status: 500 }
    );
  }
}, {
  limit: 30,
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const userId = (req as any).user?.userId || 'anonymous';
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `payments-checkout:${userId}:${ip}`;
  }
})));