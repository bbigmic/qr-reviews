import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Context = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: Request,
  context: Context
): Promise<Response> {
  try {
    const id = context.params.id;

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