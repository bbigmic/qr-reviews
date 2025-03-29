import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const signups = await prisma.affiliateSignup.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(signups);
  } catch (error) {
    console.error('Błąd podczas pobierania zgłoszeń:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania zgłoszeń' },
      { status: 500 }
    );
  }
} 