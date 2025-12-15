import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { getShift } from '@/lib/sideshift';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ giftId: string }> }
) {
  try {
    const { giftId } = await params;
    const db = await getDb();
    const gift = await db.collection('gifts').findOne({ giftId });

    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    const userIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1';

    if (gift.depositShiftId) {
      try {
        const shiftStatus = await getShift(gift.depositShiftId, userIp);
        
        if (shiftStatus.status === 'settled' && gift.status === 'pending') {
          await db.collection('gifts').updateOne(
            { giftId },
            { 
              $set: { 
                status: 'funded',
                depositStatus: shiftStatus.status,
                settlementAmount: shiftStatus.settleAmount,
                updatedAt: new Date()
              }
            }
          );
          gift.status = 'funded';
          gift.depositStatus = shiftStatus.status;
          gift.settlementAmount = shiftStatus.settleAmount;
        } else {
          await db.collection('gifts').updateOne(
            { giftId },
            { $set: { depositStatus: shiftStatus.status, updatedAt: new Date() } }
          );
          gift.depositStatus = shiftStatus.status;
        }
      } catch (e) {
        console.error('Error fetching shift status:', e);
      }
    }

    return NextResponse.json(gift);
  } catch (error) {
    console.error('Error fetching gift:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch gift' },
      { status: 500 }
    );
  }
}
