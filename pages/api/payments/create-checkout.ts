import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { auth } from '@/lib/auth';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2025-06-30.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = await auth(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { 
      priceId, 
      successUrl, 
      cancelUrl,
      metadata = {}
    } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env['NEXT_PUBLIC_BASE_URL']}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env['NEXT_PUBLIC_BASE_URL']}/cancel`,
      metadata: {
        userId: user.id,
        userEmail: user.email,
        ...metadata
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          userEmail: user.email,
          ...metadata
        }
      }
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
      details: process.env['NODE_ENV'] === 'development' && typeof error === 'object' && error && 'message' in error ? (error as any).message : undefined
    });
  }
} 