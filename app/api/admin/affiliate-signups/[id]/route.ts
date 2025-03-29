import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const { id } = params;

    if (!status || !['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status' },
        { status: 400 }
      );
    }

    const signup = await prisma.affiliateSignup.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(signup);
  } catch (error) {
    console.error('Błąd podczas aktualizacji zgłoszenia:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji zgłoszenia' },
      { status: 500 }
    );
  }
} 