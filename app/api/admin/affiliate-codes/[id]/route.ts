import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Usuwamy kod afiliacyjny
    await prisma.affiliateCode.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas usuwania kodu:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas usuwania kodu' },
      { status: 500 }
    );
  }
} 