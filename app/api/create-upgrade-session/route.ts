import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { placeId } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { error: 'Brak wymaganego parametru placeId' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Ulepszenie QR kodu o logo',
              description: 'Dodaj logo swojej firmy do kodu QR',
            },
            unit_amount: 2000, // 20 zł w groszach
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        placeId: placeId,
        type: 'upgrade',
        amount: 2000
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?placeId=${placeId}&session_id={CHECKOUT_SESSION_ID}&type=upgrade`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      payment_intent_data: {
        metadata: {
          placeId: placeId,
          type: 'upgrade'
        },
      },
    });

    if (!session?.id) {
      throw new Error('Nie udało się utworzyć sesji płatności');
    }

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Błąd:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia sesji płatności' },
      { status: 500 }
    );
  }
} 