import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const isAuthenticated = cookieStore.get('admin-auth')?.value === 'true';

    if (isAuthenticated) {
      return NextResponse.json({ authorized: true });
    }

    return NextResponse.json(
      { authorized: false },
      { status: 401 }
    );
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas sprawdzania autoryzacji' },
      { status: 500 }
    );
  }
} 