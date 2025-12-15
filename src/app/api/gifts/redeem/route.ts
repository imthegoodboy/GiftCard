import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { createVariableShift } from '@/lib/sideshift';
import { RedeemGiftRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: RedeemGiftRequest = await request.json();
    const { giftId, redeemCoin, redeemNetwork, redeemAddress } = body;

    if (!giftId || !redeemCoin || !redeemNetwork || !redeemAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const gift = await db.collection('gifts').findOne({ giftId });

    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    if (gift.status !== 'funded') {
      return NextResponse.json(
        { error: `Gift cannot be redeemed. Current status: ${gift.status}` },
        { status: 400 }
      );
    }

    if (gift.expiresAt && new Date(gift.expiresAt) < new Date()) {
      await db.collection('gifts').updateOne(
        { giftId },
        { $set: { status: 'expired', updatedAt: new Date() } }
      );
      return NextResponse.json({ error: 'Gift has expired' }, { status: 400 });
    }

    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';

    const shift = await createVariableShift(
      gift.settlementCoin,
      gift.settlementNetwork,
      redeemCoin,
      redeemNetwork,
      redeemAddress,
      undefined,
      userIp
    );

    await db.collection('gifts').updateOne(
      { giftId },
      {
        $set: {
          status: 'claimed',
          redeemShiftId: shift.id,
          redeemCoin,
          redeemNetwork,
          redeemAddress,
          redeemStatus: shift.status,
          claimedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      shiftId: shift.id,
      depositAddress: shift.depositAddress,
      redeemCoin,
      redeemNetwork,
      redeemAddress,
      status: shift.status,
    });
  } catch (error) {
    console.error('Error redeeming gift:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to redeem gift' },
      { status: 500 }
    );
  }
}
