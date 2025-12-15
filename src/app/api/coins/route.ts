import { NextResponse } from 'next/server';
import { getCoins } from '@/lib/sideshift';

export async function GET() {
  try {
    const coins = await getCoins();
    return NextResponse.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch coins' },
      { status: 500 }
    );
  }
}
