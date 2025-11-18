import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Stripe webhook handler for subscription events
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Get user ID from client_reference_id
      const userId = session.client_reference_id;

      if (userId && session.customer) {
        // Update user with stripe customer ID and subscription tier
        await supabase
          .from('users')
          .update({
            stripe_customer_id: session.customer as string,
            subscription_tier: session.metadata?.plan || 'pro',
          })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      // Update subscription status
      await supabase
        .from('users')
        .update({
          subscription_tier: subscription.status === 'active'
            ? (subscription.metadata?.plan || 'pro')
            : 'free',
        })
        .eq('stripe_customer_id', subscription.customer as string);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      // Downgrade to free tier
      await supabase
        .from('users')
        .update({
          subscription_tier: 'free',
        })
        .eq('stripe_customer_id', subscription.customer as string);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
