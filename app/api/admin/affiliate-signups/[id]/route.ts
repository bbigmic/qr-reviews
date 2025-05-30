import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    if (!data.status || !['PENDING', 'APPROVED', 'REJECTED'].includes(data.status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status' },
        { status: 400 }
      );
    }

    const updatedSignup = await prisma.affiliateSignup.update({
      where: { id },
      data: {
        status: data.status
      }
    });

    return NextResponse.json(updatedSignup);
  } catch (error) {
    console.error('Błąd podczas aktualizacji zgłoszenia:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas aktualizacji zgłoszenia' },
      { status: 500 }
    );
  }
} 