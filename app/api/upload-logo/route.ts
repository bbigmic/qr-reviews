import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('logo') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Brak pliku logo' },
        { status: 400 }
      );
    }

    // Konwertuj plik na base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ logoUrl: dataUrl });
  } catch (error) {
    console.error('Błąd podczas przesyłania pliku:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas przesyłania pliku' },
      { status: 500 }
    );
  }
} 