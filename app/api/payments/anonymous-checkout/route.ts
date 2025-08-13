// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { withCsrfProtection } from '@/lib/security/csrf';
import { withRateLimit } from '@/lib/rate-limit';

// Initialize Stripe with proper error handling
const stripeSecretKey = process.env['STRIPE_SECRET_KEY'];
if (!stripeSecretKey) {
  console.error('STRIPE_SECRET_KEY environment variable is not set');
}

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
}) : null;

// Product pricing configuration (same as other payment routes)
const PRODUCT_PRICES = {
  // Core Products
  'novus-protocol': { monthly: 4900, yearly: 49000, name: 'NOVUS Protocol' },
  'novus-starter': { monthly: 2900, yearly: 29000, name: 'NOVUS Protocol Starter' },
  'novus-pro': { monthly: 7900, yearly: 79000, name: 'NOVUS Protocol Pro' },
  'bundle-builder': { monthly: 7900, yearly: 79000, name: 'Bundle Builder' },
  'content-spawner': { monthly: 9900, yearly: 99000, name: 'Content Spawner' },
  'auto-rewrite': { monthly: 4900, yearly: 49000, name: 'Auto Rewrite Engine' },
  'auto-rewrite-starter': { monthly: 2900, yearly: 29000, name: 'Auto Rewrite Engine Starter' },
  'auto-rewrite-professional': { monthly: 9900, yearly: 99000, name: 'Auto Rewrite Engine Professional' },
  'auto-rewrite-enterprise': { monthly: 29900, yearly: 299000, name: 'Auto Rewrite Engine Enterprise' },
  'content-spawner-creator': { monthly: 9900, yearly: 99000, name: 'Content Spawner Creator' },
  'content-spawner-agency': { monthly: 29900, yearly: 299000, name: 'Content Spawner Agency' },
  'content-spawner-enterprise': { monthly: 79900, yearly: 799000, name: 'Content Spawner Enterprise' },
  'bundle-builder-starter': { monthly: 4900, yearly: 49000, name: 'Bundle Builder Starter' },
  'bundle-builder-pro': { monthly: 9900, yearly: 99000, name: 'Bundle Builder Pro' },
  'bundle-builder-enterprise': { monthly: 29900, yearly: 299000, name: 'Bundle Builder Enterprise' },
  'time-tracking-ai-starter': { monthly: 1900, yearly: 19000, name: 'Time Tracking AI Starter' },
  'time-tracking-ai-pro': { monthly: 4900, yearly: 49000, name: 'Time Tracking AI Pro' },
  'time-tracking-ai-enterprise': { monthly: 9900, yearly: 99000, name: 'Time Tracking AI Enterprise' },
  'affiliate-portal': { monthly: 19900, yearly: 199000, name: 'Affiliate Portal' },
  'affiliate-portal-starter': { monthly: 7900, yearly: 79000, name: 'Affiliate Portal Starter' },
  'affiliate-portal-professional': { monthly: 19900, yearly: 199000, name: 'Affiliate Portal Professional' },
  'affiliate-portal-enterprise': { monthly: 49900, yearly: 499000, name: 'Affiliate Portal Enterprise' },
  
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
  'legal-ai-compliance': { monthly: 34900, yearly: 349000, name: 'Legal AI Compliance' },
  'enterprise-ai-compliance': { monthly: 79900, yearly: 799000, name: 'Enterprise AI Compliance' },
  
  // Enterprise Solutions
  'white-label-ai': { monthly: 149900, yearly: 1499000, name: 'White Label AI Solution' },
  'custom-ai-development': { monthly: 249900, yearly: 2499000, name: 'Custom AI Development' }
};

// Validation schema
const CheckoutSchema = z.object({
  productId: z.string().min(1),
  billingCycle: z.enum(['monthly', 'yearly'])
});

/**
 * POST /api/payments/anonymous-checkout
 * 
 * Create Stripe checkout session for anonymous users (no authentication required)
 * Returns checkout URL for redirection
 */
export const POST = withRateLimit(withCsrfProtection(async (request: NextRequest) => {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'STRIPE_NOT_CONFIGURED', 
            message: 'Stripe payment processing is not configured. Please set STRIPE_SECRET_KEY environment variable.' 
          } 
        },
        { status: 500 }
      );
    }

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
            message: `Product ${productId} not found` 
          } 
        },
        { status: 400 }
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
              images: [`${baseUrl}/api/og?product=${productId}`],
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
      success_url: `${baseUrl}/auth/register?session_id={CHECKOUT_SESSION_ID}&product=${productId}&plan=${billingCycle}`,
      cancel_url: `${baseUrl}/products/${productId}?checkout=cancelled`,
      metadata: {
        productId: productId,
        billingCycle: billingCycle,
        productName: productConfig.name,
        isAnonymous: 'true'
      },
      subscription_data: {
        metadata: {
          productId: productId,
          billingCycle: billingCycle,
          productName: productConfig.name,
          isAnonymous: 'true'
        }
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true
      }
      // Removed customer_creation - not valid for subscription mode
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
    console.error('Anonymous checkout creation error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
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
          message: 'Failed to create checkout session',
          details: error.message
        } 
      },
      { status: 500 }
    );
  }
}), {
  limit: 20, // 20 checkout attempts per 10 minutes per IP
  windowMs: 10 * 60 * 1000,
  key: (req: NextRequest) => {
    const ip = req.headers.get('x-forwarded-for') || 'ip-unknown';
    return `anonymous-checkout:${ip}`;
  }
});