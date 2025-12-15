import { ObjectId } from 'mongodb';

export interface GiftCard {
  _id?: ObjectId;
  giftId: string;
  status: 'pending' | 'funded' | 'claimed' | 'expired' | 'refunded';
  amountUsd: number;
  message?: string;
  senderAddress?: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  depositShiftId?: string;
  depositCoin?: string;
  depositNetwork?: string;
  depositAddress?: string;
  depositAmount?: string;
  depositStatus?: string;
  
  settlementCoin: string;
  settlementNetwork: string;
  settlementAmount?: string;
  
  redeemShiftId?: string;
  redeemCoin?: string;
  redeemNetwork?: string;
  redeemAddress?: string;
  redeemAmount?: string;
  redeemStatus?: string;
  claimedAt?: Date;
}

export interface CreateGiftRequest {
  amountUsd: number;
  message?: string;
  expiresAt?: string;
  depositCoin: string;
  depositNetwork: string;
  senderAddress?: string;
}

export interface RedeemGiftRequest {
  giftId: string;
  redeemCoin: string;
  redeemNetwork: string;
  redeemAddress: string;
}