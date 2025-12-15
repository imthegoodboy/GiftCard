"use client";

import { useState, useEffect, useCallback, use } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Copy, Check, Loader2, PartyPopper, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';
import Link from 'next/link';

interface Coin {
  coin: string;
  networks: string[];
  name: string;
}

interface GiftData {
  giftId: string;
  status: string;
  amountUsd: number;
  message?: string;
  depositStatus?: string;
  settlementAmount?: string;
  settlementCoin?: string;
}

const popularCoins = ['USDT', 'USDC', 'ETH', 'BTC', 'SOL', 'MATIC', 'BNB', 'AVAX'];

export default function RedeemGiftPage({ params }: { params: Promise<{ giftId: string }> }) {
  const { giftId } = use(params);
  
  const [gift, setGift] = useState<GiftData | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  const fetchGift = useCallback(async () => {
    try {
      const res = await fetch(`/api/gifts/${giftId}`);
      const data = await res.json();
      if (res.ok) {
        setGift(data);
      } else {
        toast.error(data.error || 'Gift not found');
      }
    } catch (error) {
      console.error('Error fetching gift:', error);
      toast.error('Failed to load gift');
    } finally {
      setLoading(false);
    }
  }, [giftId]);

  useEffect(() => {
    fetchGift();
    const interval = setInterval(fetchGift, 30000);
    return () => clearInterval(interval);
  }, [fetchGift]);

  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await fetch('/api/coins');
        const data = await res.json();
        if (Array.isArray(data)) {
          const filtered = data.filter((c: Coin) => 
            c.networks && c.networks.length > 0 && !c.coin.includes('TEST')
          );
          setCoins(filtered);
        }
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setCoinsLoading(false);
      }
    }
    fetchCoins();
  }, []);

  const selectedCoinData = coins.find(c => c.coin === selectedCoin);
  const availableNetworks = selectedCoinData?.networks || [];

  const handleCoinChange = (coin: string) => {
    setSelectedCoin(coin);
    setSelectedNetwork('');
  };

  const handleRedeem = async () => {
    if (!selectedCoin || !selectedNetwork || !walletAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    setRedeeming(true);
    try {
      const res = await fetch('/api/gifts/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId,
          redeemCoin: selectedCoin,
          redeemNetwork: selectedNetwork,
          redeemAddress: walletAddress,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to redeem gift');
      }

      setRedeemSuccess(true);
      toast.success('Gift redeemed successfully! Funds are on the way.');
    } catch (error) {
      console.error('Error redeeming gift:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to redeem gift');
    } finally {
      setRedeeming(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const sortedCoins = [...coins].sort((a, b) => {
    const aPopular = popularCoins.indexOf(a.coin);
    const bPopular = popularCoins.indexOf(b.coin);
    if (aPopular !== -1 && bPopular !== -1) return aPopular - bPopular;
    if (aPopular !== -1) return -1;
    if (bPopular !== -1) return 1;
    return a.coin.localeCompare(b.coin);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funded': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'claimed': return 'text-blue-500';
      case 'expired': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'funded': return <Gift className="w-5 h-5" />;
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'claimed': return <Check className="w-5 h-5" />;
      case 'expired': return <AlertCircle className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </main>
    );
  }

  if (!gift) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Gift Not Found</h1>
          <p className="text-muted-foreground mb-6">This gift card doesn&apos;t exist or has been removed.</p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (redeemSuccess) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        </div>

        <div className="relative pt-24 pb-12 px-4">
          <div className="max-w-lg mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-purple-500 flex items-center justify-center mx-auto mb-8"
            >
              <PartyPopper className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-4"
            >
              Gift <span className="gradient-text">Redeemed!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Your {selectedCoin} is being sent to your wallet. It should arrive within a few minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6 mb-6"
            >
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-green-500">${gift.amountUsd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Receiving</span>
                  <span>{selectedCoin} on {selectedNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet</span>
                  <span className="font-mono text-sm truncate max-w-[200px]">{walletAddress}</span>
                </div>
              </div>
            </motion.div>

            <Button asChild className="bg-gradient-to-r from-purple-500 to-green-500">
              <Link href="/">Create Your Own Gift</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-2xl p-6 md:p-8 mb-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">You received a gift!</h1>
                <div className={`flex items-center gap-2 ${getStatusColor(gift.status)}`}>
                  {getStatusIcon(gift.status)}
                  <span className="capitalize">{gift.status}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-green-500/10 rounded-xl p-6 text-center mb-6">
              <div className="text-5xl font-bold gradient-text mb-2">
                ${gift.amountUsd}
              </div>
              <div className="text-muted-foreground">Gift Card Value</div>
            </div>

            {gift.message && (
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <div className="text-sm text-muted-foreground mb-1">Message from sender</div>
                <p className="text-lg">&quot;{gift.message}&quot;</p>
              </div>
            )}

            {gift.status === 'pending' && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">Awaiting Deposit</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  The sender hasn&apos;t deposited yet. Once they send the funds, you&apos;ll be able to redeem this gift.
                </p>
              </div>
            )}

            {gift.status === 'claimed' && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Already Claimed</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This gift has already been redeemed.
                </p>
              </div>
            )}

            {gift.status === 'expired' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-semibold">Gift Expired</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This gift card has expired and can no longer be redeemed.
                </p>
              </div>
            )}
          </motion.div>

          {gift.status === 'funded' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-bold mb-6">Choose How to Receive</h2>

              <div className="space-y-6">
                <div>
                  <Label className="text-base mb-2 block">Select Cryptocurrency</Label>
                  {coinsLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading available coins...
                    </div>
                  ) : (
                    <Select value={selectedCoin} onValueChange={handleCoinChange}>
                      <SelectTrigger className="bg-secondary/50 border-border h-12">
                        <SelectValue placeholder="Select coin to receive" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {sortedCoins.map((coin) => (
                          <SelectItem key={coin.coin} value={coin.coin}>
                            <span className="flex items-center gap-2">
                              <span className="font-medium">{coin.coin}</span>
                              <span className="text-muted-foreground text-sm">{coin.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedCoin && availableNetworks.length > 0 && (
                  <div>
                    <Label className="text-base mb-2 block">Select Network</Label>
                    <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                      <SelectTrigger className="bg-secondary/50 border-border h-12">
                        <SelectValue placeholder="Select network" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNetworks.map((network) => (
                          <SelectItem key={network} value={network}>
                            {network}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="walletAddress" className="text-base mb-2 block">Your Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder={`Enter your ${selectedCoin || 'crypto'} wallet address`}
                    className="bg-secondary/50 border-border h-12"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Make sure this address is on the {selectedNetwork || 'selected'} network.
                  </p>
                </div>

                <Button
                  onClick={handleRedeem}
                  disabled={redeeming || !selectedCoin || !selectedNetwork || !walletAddress}
                  className="w-full bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 h-14 text-lg"
                >
                  {redeeming ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Redeem Gift
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
