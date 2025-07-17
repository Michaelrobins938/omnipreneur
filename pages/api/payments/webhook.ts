import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env['STRIPE_SECRET_KEY']!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env['STRIPE_WEBHOOK_SECRET']!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig as string, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCreated(subscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.['userId'];
  if (!userId) {
    console.error('No userId in session metadata');
    return;
  }

  // Update user subscription status
  await updateUserSubscription(userId, {
    status: 'active',
    plan: session.metadata?.['plan'] || 'pro',
    sessionId: session.id,
    customerId: session.customer as string
  });
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.['userId'];
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Update user subscription
  await updateUserSubscription(userId, {
    status: 'active',
    plan: subscription.metadata?.['plan'] || 'pro',
    subscriptionId: subscription.id,
    customerId: subscription.customer as string,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.['userId'];
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Update user subscription
  await updateUserSubscription(userId, {
    status: subscription.status,
    plan: subscription.metadata?.['plan'] || 'pro',
    subscriptionId: subscription.id,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000)
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.['userId'];
  if (!userId) {
    console.error('No userId in subscription metadata');
    return;
  }

  // Update user subscription to cancelled
  await updateUserSubscription(userId, {
    status: 'cancelled',
    plan: 'free',
    subscriptionId: subscription.id
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  // Log successful payment
  await logPayment({
    subscriptionId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    timestamp: new Date()
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  // Log failed payment
  await logPayment({
    subscriptionId,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    timestamp: new Date()
  });
}

// Database functions (placeholder implementations)
async function updateUserSubscription(userId: string, data: any) {
  // Database integration - placeholder for production
  console.log('Updating user subscription:', { userId, data });
}

async function logPayment(data: any) {
  // Database integration - placeholder for production
  console.log('Logging payment:', data);
} 