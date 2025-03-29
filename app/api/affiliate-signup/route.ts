import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, phone } = await request.json();

    // Walidacja danych
    if (!email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    // Zapisz zgłoszenie w bazie danych
    await prisma.affiliateSignup.create({
      data: {
        email,
        phone,
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas zapisywania zgłoszenia:', error);
    return NextResponse.json(
      { success: false, error: 'Wystąpił błąd podczas przetwarzania zgłoszenia' },
      { status: 500 }
    );
  }
} 