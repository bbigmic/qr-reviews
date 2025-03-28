import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const REGULAR_PRICE = 19900; // 199 zł w groszach

type DiscountCodes = {
  [key: string]: number;
};

const DISCOUNT_CODES: DiscountCodes = {
  'rabat40': 40, // 40% zniżki
  // Tutaj możemy dodać więcej kodów rabatowych
};

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Brak klucza Stripe');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { placeId, discountCode } = await request.json();

    if (!placeId) {
      return NextResponse.json({ error: 'Brak wymaganego parametru placeId' }, { status: 400 });
    }

    let finalPrice = REGULAR_PRICE;
    if (discountCode) {
      const discount = DISCOUNT_CODES[discountCode.toLowerCase()];
      if (discount) {
        // Obliczamy cenę w groszach po rabacie
        finalPrice = Math.round(REGULAR_PRICE * (1 - discount / 100));
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Kod QR do opinii Google',
              description: 'Unikalny kod QR kierujący do wystawienia opinii w Google',
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}?success=true&placeId=${placeId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}?canceled=true`,
      metadata: {
        placeId,
        discountCode: discountCode || '',
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Błąd tworzenia sesji płatności:', error);
    return NextResponse.json(
      { error: 'Nie udało się utworzyć sesji płatności' },
      { status: 500 }
    );
  }
} 