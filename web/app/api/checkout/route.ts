import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';

/**
 * Create Stripe checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const priceId = formData.get('priceId') as string;

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // TODO: Get user ID from session
    const userId = 'temp-user-id'; // Replace with actual user ID from session

    const session = await createCheckoutSession(
      userId,
      priceId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`
    );

    return NextResponse.redirect(session.url!);
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
