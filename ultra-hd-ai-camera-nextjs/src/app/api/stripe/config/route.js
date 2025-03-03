import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: 10,
      expand: ['data.product']
    });

    return NextResponse.json(prices.data);
  } catch (error) {
    console.error('Error fetching prices:', error);
    return NextResponse.json(
      { error: 'Error fetching prices' },
      { status: 500 }
    );
  }
} 