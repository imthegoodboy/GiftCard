import { NextRequest, NextResponse } from 'next/server';
import { getPair } from '@/lib/sideshift';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const depositCoin = searchParams.get('depositCoin');
    const depositNetwork = searchParams.get('depositNetwork');
    const settleCoin = searchParams.get('settleCoin');
    const settleNetwork = searchParams.get('settleNetwork');

    if (!depositCoin || !depositNetwork || !settleCoin || !settleNetwork) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const pair = await getPair(depositCoin, depositNetwork, settleCoin, settleNetwork);
    return NextResponse.json(pair);
  } catch (error) {
    console.error('Error fetching pair:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch pair' },
      { status: 500 }
    );
  }
}
