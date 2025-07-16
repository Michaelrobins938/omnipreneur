import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { auth } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authentication
    const user = await auth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      plan, 
      price, 
      productName,
      successUrl,
      cancelUrl 
    } = req.body;

    if (!plan || !price || !productName) {
      return res.status(400).json({ error: 'Plan, price, and product name are required' });
    }

    // Validate plan
    const validPlans = ['free', 'pro', 'enterprise'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: `Omnipreneur ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              images: ['https://omnipreneur.com/logo.png'], // Replace with actual logo
            },
            unit_amount: Math.round(parseFloat(price) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        plan,
        productName
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: {
          userId: user.id,
          plan,
          productName
        }
      }
    });

    // Save checkout session to database
    await saveCheckoutSession({
      userId: user.id,
      sessionId: session.id,
      plan,
      price: parseFloat(price),
      productName,
      status: 'pending',
      timestamp: new Date()
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Checkout API error:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

async function saveCheckoutSession(data: any) {
  // Database integration - placeholder for now
  // Logging removed for production
} 