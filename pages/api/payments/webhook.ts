import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

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
  const { userId, plan, productName } = session.metadata!;

  // Update user subscription
  await updateUserSubscription({
    userId,
    plan,
    productName,
    sessionId: session.id,
    amount: session.amount_total! / 100, // Convert from cents
    status: 'active',
    timestamp: new Date()
  });

  // Send welcome email
  await sendWelcomeEmail({
    userId,
    plan,
    productName,
    amount: session.amount_total! / 100
  });

  console.log(`Checkout completed for user ${userId}, plan: ${plan}`);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const { userId, plan, productName } = paymentIntent.metadata;

  // Update payment status
  await updatePaymentStatus({
    paymentIntentId: paymentIntent.id,
    userId,
    status: 'succeeded',
    amount: paymentIntent.amount / 100,
    timestamp: new Date()
  });

  console.log(`Payment succeeded for user ${userId}, amount: $${paymentIntent.amount / 100}`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { userId, plan, productName } = paymentIntent.metadata;

  // Update payment status
  await updatePaymentStatus({
    paymentIntentId: paymentIntent.id,
    userId,
    status: 'failed',
    amount: paymentIntent.amount / 100,
    timestamp: new Date()
  });

  // Send failure notification
  await sendPaymentFailureEmail({
    userId,
    plan,
    productName,
    amount: paymentIntent.amount / 100
  });

  console.log(`Payment failed for user ${userId}, amount: $${paymentIntent.amount / 100}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata.userId;

  // Update user subscription
  await updateUserSubscription({
    userId,
    plan: subscription.metadata.plan || 'pro',
    status: 'active',
    subscriptionId: subscription.id,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    timestamp: new Date()
  });

  console.log(`Subscription created for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata.userId;

  // Update user subscription
  await updateUserSubscription({
    userId,
    plan: subscription.metadata.plan || 'pro',
    status: subscription.status,
    subscriptionId: subscription.id,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    timestamp: new Date()
  });

  console.log(`Subscription updated for user ${userId}, status: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata.userId;

  // Update user subscription
  await updateUserSubscription({
    userId,
    plan: 'free',
    status: 'cancelled',
    subscriptionId: subscription.id,
    timestamp: new Date()
  });

  // Send cancellation email
  await sendCancellationEmail({
    userId,
    plan: subscription.metadata.plan || 'pro'
  });

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata.userId;

  // Update invoice status
  await updateInvoiceStatus({
    invoiceId: invoice.id,
    userId,
    status: 'paid',
    amount: invoice.amount_paid / 100,
    timestamp: new Date()
  });

  console.log(`Invoice payment succeeded for user ${userId}, amount: $${invoice.amount_paid / 100}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
  const userId = customer.metadata.userId;

  // Update invoice status
  await updateInvoiceStatus({
    invoiceId: invoice.id,
    userId,
    status: 'failed',
    amount: invoice.amount_due / 100,
    timestamp: new Date()
  });

  // Send payment failure notification
  await sendInvoicePaymentFailureEmail({
    userId,
    amount: invoice.amount_due / 100
  });

  console.log(`Invoice payment failed for user ${userId}, amount: $${invoice.amount_due / 100}`);
}

// Database functions (placeholders)
async function updateUserSubscription(data: any) {
  console.log('Updating user subscription:', data);
}

async function updatePaymentStatus(data: any) {
  console.log('Updating payment status:', data);
}

async function updateInvoiceStatus(data: any) {
  console.log('Updating invoice status:', data);
}

// Email functions (placeholders)
async function sendWelcomeEmail(data: any) {
  console.log('Sending welcome email:', data);
}

async function sendPaymentFailureEmail(data: any) {
  console.log('Sending payment failure email:', data);
}

async function sendCancellationEmail(data: any) {
  console.log('Sending cancellation email:', data);
}

async function sendInvoicePaymentFailureEmail(data: any) {
  console.log('Sending invoice payment failure email:', data);
} 