"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Gift, Search, Copy, Check, Loader2, AlertCircle, Clock, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';
import Link from 'next/link';

interface GiftData {
  giftId: string;
  status: string;
  amountUsd: number;
  message?: string;
  depositCoin?: string;
  depositNetwork?: string;
  depositAddress?: string;
  depositAmount?: string;
  depositStatus?: string;
  settlementAmount?: string;
  settlementCoin?: string;
  redeemCoin?: string;
  redeemNetwork?: string;
  redeemAddress?: string;
  createdAt: string;
  claimedAt?: string;
}

function TrackGiftContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [giftId, setGiftId] = useState(initialId);
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchGift = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/gifts/${id}`);
      const data = await res.json();
      if (res.ok) {
        setGift(data);
      } else {
        toast.error(data.error || 'Gift not found');
        setGift(null);
      }
    } catch (error) {
      console.error('Error fetching gift:', error);
      toast.error('Failed to load gift');
      setGift(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      fetchGift(initialId);
    }
  }, [initialId, fetchGift]);

  useEffect(() => {
    if (autoRefresh && gift && gift.status === 'pending') {
      const interval = setInterval(() => fetchGift(giftId), 15000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, gift, giftId, fetchGift]);

  const handleSearch = () => {
    if (giftId) {
      fetchGift(giftId);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'claimed': return 'bg-blue-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'funded': return 'Ready to Claim';
      case 'pending': return 'Awaiting Deposit';
      case 'claimed': return 'Redeemed';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-[120px]" />
      </div>

      <div className="relative pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Track <span className="gradient-text">Gift Card</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Check the status of your gift card
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-6"
          >
            <Label className="text-base mb-2 block">Gift Card ID</Label>
            <div className="flex gap-2">
              <Input
                value={giftId}
                onChange={(e) => setGiftId(e.target.value)}
                placeholder="Enter your gift card ID"
                className="bg-secondary/50 border-border h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={loading || !giftId}
                className="h-12 px-6 bg-gradient-to-r from-purple-500 to-green-500"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </Button>
            </div>
          </motion.div>

          {gift && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center">
                      <Gift className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">${gift.amountUsd}</h2>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(gift.status)}`} />
                        <span className="text-muted-foreground">{getStatusText(gift.status)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchGift(giftId)}
                    disabled={loading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {gift.status === 'pending' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                      <Clock className="w-5 h-5" />
                      <span className="font-semibold">Waiting for Deposit</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Send {gift.depositAmount} {gift.depositCoin} to the address below:
                    </p>
                    {gift.depositAddress && (
                      <div className="flex gap-2">
                        <Input
                          value={gift.depositAddress}
                          readOnly
                          className="bg-secondary/50 border-border font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(gift.depositAddress!, 'deposit')}
                        >
                          {copied === 'deposit' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        id="autoRefresh"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="autoRefresh" className="text-sm text-muted-foreground">
                        Auto-refresh every 15 seconds
                      </label>
                    </div>
                  </div>
                )}

                {gift.status === 'funded' && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-500 mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Ready to Redeem</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      This gift card is funded and ready to be claimed!
                    </p>
                    <Button asChild className="w-full bg-green-500 hover:bg-green-600">
                      <Link href={`/redeem/${gift.giftId}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Redeem Gift Card
                      </Link>
                    </Button>
                  </div>
                )}

                {gift.status === 'claimed' && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Successfully Redeemed</span>
                    </div>
                    {gift.redeemCoin && (
                      <p className="text-sm text-muted-foreground">
                        Redeemed as {gift.redeemCoin} on {gift.redeemNetwork}
                      </p>
                    )}
                    {gift.claimedAt && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Claimed on {formatDate(gift.claimedAt)}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="font-semibold">Gift Details</h3>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <div className="text-muted-foreground mb-1">Gift ID</div>
                      <div className="font-mono text-xs truncate">{gift.giftId}</div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <div className="text-muted-foreground mb-1">Created</div>
                      <div className="text-xs">{formatDate(gift.createdAt)}</div>
                    </div>
                    {gift.depositCoin && (
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <div className="text-muted-foreground mb-1">Deposit Coin</div>
                        <div>{gift.depositCoin} ({gift.depositNetwork})</div>
                      </div>
                    )}
                    {gift.depositStatus && (
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <div className="text-muted-foreground mb-1">Deposit Status</div>
                        <div className="capitalize">{gift.depositStatus}</div>
                      </div>
                    )}
                    {gift.settlementAmount && (
                      <div className="bg-secondary/30 rounded-lg p-3">
                        <div className="text-muted-foreground mb-1">Settlement Amount</div>
                        <div>{gift.settlementAmount} {gift.settlementCoin}</div>
                      </div>
                    )}
                    {gift.message && (
                      <div className="bg-secondary/30 rounded-lg p-3 col-span-2">
                        <div className="text-muted-foreground mb-1">Message</div>
                        <div>&quot;{gift.message}&quot;</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => copyToClipboard(`${window.location.origin}/redeem/${gift.giftId}`, 'link')}
                    >
                      {copied === 'link' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copy Gift Link
                    </Button>
                    <Button asChild className="flex-1 bg-gradient-to-r from-purple-500 to-green-500">
                      <Link href={`/redeem/${gift.giftId}`}>
                        View Gift Page
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {!gift && !loading && giftId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Gift Not Found</h3>
              <p className="text-muted-foreground">
                No gift card found with this ID. Please check and try again.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function TrackGiftPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </main>
    }>
      <TrackGiftContent />
    </Suspense>
  );
}
