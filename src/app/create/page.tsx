"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Copy, Check, Loader2, QrCode, Share2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';
import Link from 'next/link';

interface Coin {
  coin: string;
  networks: string[];
  name: string;
}

interface GiftResult {
  giftId: string;
  depositAddress: string;
  depositAmount: string;
  depositCoin: string;
  depositNetwork: string;
  giftLink: string;
  min: string;
  max: string;
}

const popularCoins = ['BTC', 'ETH', 'SOL', 'USDT', 'USDC', 'MATIC', 'BNB', 'AVAX', 'DOT', 'ADA'];

export default function CreateGiftPage() {
  const [step, setStep] = useState(1);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  const [amount, setAmount] = useState('25');
  const [message, setMessage] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  
  const [giftResult, setGiftResult] = useState<GiftResult | null>(null);

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
        toast.error('Failed to load available coins');
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

  const handleCreateGift = async () => {
    if (!amount || !selectedCoin || !selectedNetwork) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/gifts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUsd: parseFloat(amount),
          message,
          depositCoin: selectedCoin,
          depositNetwork: selectedNetwork,
          senderAddress: senderAddress || undefined,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create gift');
      }

      setGiftResult(data);
      setStep(2);
      
      const qrRes = await fetch(`/api/qrcode?data=${encodeURIComponent(window.location.origin + data.giftLink)}`);
      const qrData = await qrRes.json();
      if (qrData.qrCode) {
        setQrCode(qrData.qrCode);
      }
      
      toast.success('Gift card created! Send the deposit to continue.');
    } catch (error) {
      console.error('Error creating gift:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create gift');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = useCallback((text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const sortedCoins = [...coins].sort((a, b) => {
    const aPopular = popularCoins.indexOf(a.coin);
    const bPopular = popularCoins.indexOf(b.coin);
    if (aPopular !== -1 && bPopular !== -1) return aPopular - bPopular;
    if (aPopular !== -1) return -1;
    if (bPopular !== -1) return 1;
    return a.coin.localeCompare(b.coin);
  });

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
              Create <span className="gradient-text">Gift Card</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Send crypto to anyone, let them choose how to receive it.
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-500' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-purple-500 text-white' : 'bg-secondary'}`}>
                1
              </div>
              <span className="hidden sm:inline">Configure</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-500' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-purple-500 text-white' : 'bg-secondary'}`}>
                2
              </div>
              <span className="hidden sm:inline">Deposit</span>
            </div>
            <div className="w-12 h-px bg-border" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-green-500' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-green-500 text-white' : 'bg-secondary'}`}>
                3
              </div>
              <span className="hidden sm:inline">Share</span>
            </div>
          </div>

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="text-base mb-2 block">Gift Amount (USD)</Label>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {[10, 25, 50, 100, 250].map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant={amount === String(preset) ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAmount(String(preset))}
                        className={amount === String(preset) ? "bg-purple-500 hover:bg-purple-600" : ""}
                      >
                        ${preset}
                      </Button>
                    ))}
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    className="bg-secondary/50 border-border h-12"
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-base mb-2 block">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    className="bg-secondary/50 border-border min-h-[100px]"
                    maxLength={500}
                  />
                </div>

                <div>
                  <Label className="text-base mb-2 block">Payment Cryptocurrency</Label>
                  {coinsLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading available coins...
                    </div>
                  ) : (
                    <Select value={selectedCoin} onValueChange={handleCoinChange}>
                      <SelectTrigger className="bg-secondary/50 border-border h-12">
                        <SelectValue placeholder="Select coin" />
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
                    <Label className="text-base mb-2 block">Network</Label>
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
                  <Label htmlFor="senderAddress" className="text-base mb-2 block">Refund Address (Optional)</Label>
                  <Input
                    id="senderAddress"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    placeholder="Your wallet address for refunds"
                    className="bg-secondary/50 border-border h-12"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    In case of issues, funds will be returned here.
                  </p>
                </div>

                <Button
                  onClick={handleCreateGift}
                  disabled={loading || !amount || !selectedCoin || !selectedNetwork}
                  className="w-full bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 h-14 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Creating Gift...
                    </>
                  ) : (
                    <>
                      Create Gift Card
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && giftResult && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Deposit Required</h2>
                    <p className="text-muted-foreground">Send crypto to activate your gift card</p>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Amount to Send</span>
                    <span className="text-2xl font-bold text-green-500">
                      {giftResult.depositAmount} {giftResult.depositCoin}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <span>{giftResult.depositNetwork}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-muted-foreground">Min / Max</span>
                    <span>{giftResult.min} - {giftResult.max}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Deposit Address</Label>
                  <div className="flex gap-2">
                    <Input
                      value={giftResult.depositAddress}
                      readOnly
                      className="bg-secondary/50 border-border h-12 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0"
                      onClick={() => copyToClipboard(giftResult.depositAddress, 'address')}
                    >
                      {copied === 'address' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <p className="text-yellow-500 text-sm">
                    <strong>Important:</strong> Only send {giftResult.depositCoin} on the {giftResult.depositNetwork} network. 
                    Sending other coins or using wrong network may result in permanent loss.
                  </p>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 h-14 text-lg"
                >
                  I&apos;ve Sent the Deposit
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && giftResult && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-6 md:p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center mx-auto mb-6">
                  <Gift className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold mb-2">Gift Card Ready!</h2>
                <p className="text-muted-foreground mb-8">
                  Share this link with your recipient. Once the deposit is confirmed, they can redeem it.
                </p>

                {qrCode && (
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-2xl">
                      <img src={qrCode} alt="Gift QR Code" className="w-48 h-48" />
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <Label className="text-base">Gift Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`${typeof window !== 'undefined' ? window.location.origin : ''}${giftResult.giftLink}`}
                      readOnly
                      className="bg-secondary/50 border-border h-12 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 shrink-0"
                      onClick={() => copyToClipboard(`${window.location.origin}${giftResult.giftLink}`, 'link')}
                    >
                      {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12"
                    onClick={() => copyToClipboard(`${window.location.origin}${giftResult.giftLink}`, 'link')}
                  >
                    <Copy className="mr-2 w-4 h-4" />
                    Copy Link
                  </Button>
                  <Button asChild className="flex-1 h-12 bg-gradient-to-r from-purple-500 to-green-500">
                    <Link href={`/track?id=${giftResult.giftId}`}>
                      <ExternalLink className="mr-2 w-4 h-4" />
                      Track Gift
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="font-semibold mb-3">What happens next?</h3>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">1.</span>
                    Your deposit will be confirmed (usually 10-30 minutes)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">2.</span>
                    The gift card status will change to &quot;Funded&quot;
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">3.</span>
                    Recipient opens the link and chooses their preferred crypto
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">4.</span>
                    Funds are swapped and sent directly to their wallet
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
