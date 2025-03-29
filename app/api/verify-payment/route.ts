import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

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

    // Sprawdź czy zamówienie już istnieje
    const existingOrder = await prisma.order.findUnique({
      where: { id: session.id }
    });

    if (existingOrder) {
      // Jeśli zamówienie istnieje, zwróć jego status
      return NextResponse.json({
        success: existingOrder.status === 'completed'
      });
    }

    if (session.payment_status === 'paid') {
      // Utwórz zamówienie w bazie danych
      await prisma.order.create({
        data: {
          id: session.id,
          placeId: session.metadata?.placeId || '',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'completed',
          orderType: session.metadata?.type === 'upgrade' ? 'upgrade' : 'standard',
          codeId: session.metadata?.discountCode ? 
            (await prisma.affiliateCode.findUnique({ 
              where: { code: session.metadata.discountCode } 
            }))?.id : undefined
        }
      });
      return NextResponse.json({ success: true });
    } else {
      // Utwórz zamówienie ze statusem pending
      await prisma.order.create({
        data: {
          id: session.id,
          placeId: session.metadata?.placeId || '',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          status: 'pending',
          orderType: session.metadata?.type === 'upgrade' ? 'upgrade' : 'standard',
          codeId: session.metadata?.discountCode ? 
            (await prisma.affiliateCode.findUnique({ 
              where: { code: session.metadata.discountCode } 
            }))?.id : undefined
        }
      });
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