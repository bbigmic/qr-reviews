import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Najpierw sprawdź stałe kody rabatowe
    const staticDiscount = DISCOUNT_CODES[code.toLowerCase()];
    if (staticDiscount) {
      return NextResponse.json({ 
        success: true, 
        discount: staticDiscount,
        message: `Kod rabatowy został zastosowany. Zniżka: ${staticDiscount}%`
      });
    }

    // Jeśli nie znaleziono statycznego kodu, sprawdź kody afiliacyjne
    const affiliateCode = await prisma.affiliateCode.findFirst({
      where: {
        code: code,
        isActive: true
      }
    });

    if (!affiliateCode) {
      return NextResponse.json(
        { error: 'Nieprawidłowy kod rabatowy' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      discount: affiliateCode.discount,
      message: `Kod rabatowy został zastosowany. Zniżka: ${affiliateCode.discount}%`,
      isAffiliateCode: true,
      affiliateId: affiliateCode.id
    });
  } catch (error) {
    console.error('Error verifying discount code:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas weryfikacji kodu' },
      { status: 500 }
    );
  }
} 