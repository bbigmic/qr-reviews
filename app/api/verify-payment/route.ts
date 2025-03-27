import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Brak wymaganego parametru session_id' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Płatność nie została jeszcze zrealizowana' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Błąd weryfikacji płatności:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas weryfikacji płatności' },
      { status: 500 }
    );
  }
} 