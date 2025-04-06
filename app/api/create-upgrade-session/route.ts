import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const UPGRADE_PRICE = 1900; // 19 zł w groszach

type DiscountCodes = {
  [key: string]: number;
};

const DISCOUNT_CODES: DiscountCodes = {
  'rabat40': 40, // 40% zniżki
  // Tutaj możemy dodać więcej kodów rabatowych
};

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { placeId, discountCode } = await request.json();

    if (!placeId) {
      return NextResponse.json(
        { error: 'Brak wymaganego parametru placeId' },
        { status: 400 }
      );
    }

    let finalPrice = UPGRADE_PRICE;
    let affiliateCodeId = null;

    if (discountCode) {
      // Najpierw sprawdź stałe kody rabatowe
      const staticDiscount = DISCOUNT_CODES[discountCode.toLowerCase()];
      if (staticDiscount) {
        finalPrice = Math.round(UPGRADE_PRICE * (1 - staticDiscount / 100));
      } else {
        // Jeśli nie znaleziono statycznego kodu, sprawdź kody afiliacyjne
        const affiliateCode = await prisma.affiliateCode.findFirst({
          where: {
            code: {
              equals: discountCode,
              mode: 'insensitive'
            },
            isActive: true
          }
        });

        if (affiliateCode) {
          finalPrice = Math.round(UPGRADE_PRICE * (1 - affiliateCode.discount / 100));
          affiliateCodeId = affiliateCode.id;
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_configuration: process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION,
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Ulepszenie QR kodu o logo',
              description: 'Dodaj logo swojej firmy do kodu QR',
            },
            unit_amount: finalPrice,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        placeId: placeId,
        type: 'upgrade',
        amount: finalPrice,
        discountCode: discountCode || '',
        affiliateCodeId: affiliateCodeId || ''
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