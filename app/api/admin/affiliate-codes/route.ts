import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface AffiliateCodeBase {
  id: string;
  code: string;
  discount: number;
  commission: number;
  isActive: boolean;
  createdAt: Date;
}

interface AffiliateCodeWithCount extends AffiliateCodeBase {
  _count: {
    orders: number;
  };
}

// GET - pobieranie wszystkich kodów afiliacyjnych
export async function GET() {
  try {
    const codes = await prisma.affiliateCode.findMany({
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Mapujemy wyniki, aby dodać liczbę użyć
    const codesWithUsage = codes.map((code: AffiliateCodeWithCount) => ({
      ...code,
      usageCount: code._count.orders,
      _count: undefined // Usuwamy pole _count z odpowiedzi
    }));
    
    return NextResponse.json(codesWithUsage);
  } catch (error) {
    console.error('Błąd podczas pobierania kodów:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania kodów' },
      { status: 500 }
    );
  }
}

// POST - dodawanie nowego kodu afiliacyjnego
export async function POST(request: Request) {
  try {
    const { code, discount, commission } = await request.json();

    // Sprawdzanie wymaganych pól
    if (!code || discount === undefined || commission === undefined) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    // Sprawdzanie czy kod już istnieje
    const existingCode = await prisma.affiliateCode.findUnique({
      where: { code }
    });

    if (existingCode) {
      return NextResponse.json(
        { error: 'Kod już istnieje' },
        { status: 400 }
      );
    }

    // Tworzenie nowego kodu
    const newCode = await prisma.affiliateCode.create({
      data: {
        code,
        discount,
        commission,
        isActive: true
      }
    });

    return NextResponse.json(newCode);
  } catch (error) {
    console.error('Błąd podczas tworzenia kodu:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia kodu' },
      { status: 500 }
    );
  }
}

// PATCH - aktualizacja statusu kodu
export async function PATCH(request: Request) {
  try {
    const { id, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Brak ID kodu' },
        { status: 400 }
      );
    }

    const updatedCode = await prisma.affiliateCode.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('Błąd podczas aktualizacji kodu:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji kodu' },
      { status: 500 }
    );
  }
} 