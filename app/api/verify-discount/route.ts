import { NextResponse } from 'next/server';

type DiscountCodes = {
  [key: string]: number;
};

const DISCOUNT_CODES: DiscountCodes = {
  'rabat40': 40, // 40% zniżki
  // Tutaj możemy dodać więcej kodów rabatowych
};

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Nie podano kodu rabatowego' },
        { status: 400 }
      );
    }

    const discount = DISCOUNT_CODES[code.toLowerCase()];

    if (!discount) {
      return NextResponse.json(
        { error: 'Nieprawidłowy kod rabatowy' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      discount,
      message: `Kod rabatowy został zastosowany. Zniżka: ${discount}%`
    });
  } catch {
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas weryfikacji kodu' },
      { status: 500 }
    );
  }
} 