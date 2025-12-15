import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { createVariableShift, getPair } from '@/lib/sideshift';
import { GiftCard, CreateGiftRequest } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const body: CreateGiftRequest = await request.json();
    const { amountUsd, message, expiresAt, depositCoin, depositNetwork, senderAddress } = body;

    if (!amountUsd || !depositCoin || !depositNetwork) {
      return NextResponse.json(
        { error: 'Missing required fields: amountUsd, depositCoin, depositNetwork' },
        { status: 400 }
      );
    }

    const settlementCoin = 'USDT';
    const settlementNetwork = 'tron';

    if (depositCoin === settlementCoin && depositNetwork === settlementNetwork) {
      return NextResponse.json(
        { error: 'Cannot create gift with USDT on Tron network. Please choose a different cryptocurrency.' },
        { status: 400 }
      );
    }

    let userIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 request.headers.get('x-real-ip')?.trim() || 
                 request.headers.get('cf-connecting-ip')?.trim();

    if (!userIp || userIp === '::1' || userIp === '127.0.0.1' || userIp === 'localhost' || userIp.startsWith('192.168.') || userIp.startsWith('10.') || userIp.startsWith('172.16.')) {
      return NextResponse.json(
        { error: 'Unable to determine your public IP address. This is required for compliance. Please disable any VPN/proxy and try again.' },
        { status: 400 }
      );
    }

    console.log('User IP for SideShift:', userIp);

    const pairInfo = await getPair(depositCoin, depositNetwork, settlementCoin, settlementNetwork);
    
    const depositAmountInCrypto = (amountUsd / parseFloat(pairInfo.rate)).toFixed(8);

    const db = await getDb();
    const giftId = uuidv4();

    const tempSettleAddress = 'TN4C7w3fCTJTTCwdFhM3y8VhzLmGZwLVQa';

    const shift = await createVariableShift(
      depositCoin,
      depositNetwork,
      settlementCoin,
      settlementNetwork,
      tempSettleAddress,
      senderAddress,
      userIp
    );

    const gift: GiftCard = {
      giftId,
      status: 'pending',
      amountUsd,
      message,
      senderAddress,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      depositShiftId: shift.id,
      depositCoin,
      depositNetwork,
      depositAddress: shift.depositAddress,
      depositAmount: depositAmountInCrypto,
      depositStatus: shift.status,
      settlementCoin,
      settlementNetwork,
    };

    await db.collection('gifts').insertOne(gift);

    return NextResponse.json({
      success: true,
      giftId,
      depositAddress: shift.depositAddress,
      depositAmount: depositAmountInCrypto,
      depositCoin,
      depositNetwork,
      shiftId: shift.id,
      min: shift.depositMin,
      max: shift.depositMax,
      giftLink: `/redeem/${giftId}`,
    });
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create gift' },
      { status: 500 }
    );
  }
}