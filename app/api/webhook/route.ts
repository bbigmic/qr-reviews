import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Brak klucza Stripe');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Brak tajnego klucza webhooka Stripe');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature') ?? '';

  if (!signature) {
    return NextResponse.json(
      { error: 'Brak podpisu Stripe' },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { placeId, discountCode, affiliateCodeId, type } = session.metadata || {};
      const isUpgrade = type === 'upgrade';

      // Utwórz zamówienie w bazie danych
      const order = await prisma.order.create({
        data: {
          id: session.id,
          placeId: placeId || '',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'completed',
          orderType: isUpgrade ? 'upgrade' : 'standard',
          ...(affiliateCodeId ? {
            affiliateCode: {
              connect: { id: affiliateCodeId }
            }
          } : {})
        }
      });

      // Jeśli użyto kodu afiliacyjnego, zaktualizuj statystyki
      if (affiliateCodeId) {
        await prisma.affiliateCodeUsage.create({
          data: {
            affiliateCodeId: affiliateCodeId,
            orderId: order.id,
            amount: order.amount
          }
        });
      }

      console.log(`Utworzono zamówienie ${isUpgrade ? 'upgrade' : 'standardowe'} o ID: ${session.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Błąd webhooka:', error);
    return NextResponse.json(
      { error: 'Błąd przetwarzania webhooka' },
      { status: 400 }
    );
  }
} 