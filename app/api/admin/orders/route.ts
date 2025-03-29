import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - pobieranie wszystkich zamówień
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        affiliateCode: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Błąd podczas pobierania zamówień:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania zamówień' },
      { status: 500 }
    );
  }
}

// PATCH - aktualizacja statusu zamówienia
export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Błąd podczas aktualizacji zamówienia:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji zamówienia' },
      { status: 500 }
    );
  }
} 