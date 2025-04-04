import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Order {
  amount: number;
}

export async function GET() {
  try {
    // Pobieranie łącznej liczby zamówień
    const totalOrders = await prisma.order.count();

    // Pobieranie łącznego przychodu
    const orders = await prisma.order.findMany({
      where: {
        status: 'completed'
      },
      select: {
        amount: true
      }
    });
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.amount, 0);

    // Pobieranie liczby aktywnych partnerów
    const activeAffiliates = await prisma.affiliateCode.count({
      where: {
        isActive: true
      }
    });

    // Pobieranie liczby oczekujących zgłoszeń
    const pendingSignups = await prisma.affiliateSignup.count({
      where: {
        status: 'pending'
      }
    });

    // Pobieranie ostatnich zamówień
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        createdAt: true,
        amount: true,
        status: true
      }
    });

    // Pobieranie najlepszych partnerów
    const topAffiliates = await prisma.affiliateCode.findMany({
      take: 5,
      orderBy: {
        commission: 'desc'
      },
      select: {
        code: true,
        commission: true,
        usages: {
          select: {
            id: true
          }
        }
      }
    });

    // Przekształcanie danych do formatu odpowiedzi
    const formattedTopAffiliates = topAffiliates.map(affiliate => ({
      code: affiliate.code,
      commission: affiliate.commission,
      usageCount: affiliate.usages.length
    }));

    return NextResponse.json({
      totalOrders,
      totalRevenue,
      activeAffiliates,
      pendingSignups,
      recentOrders,
      topAffiliates: formattedTopAffiliates
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania statystyk' },
      { status: 500 }
    );
  }
} 