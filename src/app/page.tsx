"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gift, ArrowRight, Zap, Shield, Globe, Wallet, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';

const GiftCard3D = dynamic(() => import('@/components/GiftCard3D').then(mod => mod.GiftCard3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
    </div>
  ),
});

const features = [
  {
    icon: Globe,
    title: "Cross-Chain",
    description: "Send from any chain, receive on any chain. No limits."
  },
  {
    icon: Wallet,
    title: "Any Token",
    description: "Pay with any crypto, receiver claims in their preferred token."
  },
  {
    icon: Zap,
    title: "Instant",
    description: "Powered by SideShift API for lightning-fast swaps."
  },
  {
    icon: Shield,
    title: "Non-Custodial",
    description: "Your keys, your crypto. We never hold your funds."
  },
];

const steps = [
  {
    step: "01",
    title: "Create Gift",
    description: "Enter amount, add a message, choose your payment crypto."
  },
  {
    step: "02",
    title: "Share Link",
    description: "Get a unique gift link or QR code to share with anyone."
  },
  {
    step: "03",
    title: "Receiver Claims",
    description: "They choose their preferred chain and token to receive."
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-green-500/10 blur-[120px]" />
      </div>

      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-muted-foreground">Powered by SideShift API</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="gradient-text">Crypto Gift Cards</span>
                <br />
                <span className="text-foreground">Made Simple</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Send crypto as a gift that can be redeemed in any token, on any chain. 
                No wallet compatibility issues. Just magic.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-lg h-14 px-8">
                  <Link href="/create">
                    Create Gift Card
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8 border-border hover:bg-secondary">
                  <Link href="/track">
                    Track Your Gift
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold gradient-text">200+</div>
                  <div className="text-sm text-muted-foreground">Assets Supported</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold gradient-text">40+</div>
                  <div className="text-sm text-muted-foreground">Blockchains</div>
                </div>
                <div className="w-px h-12 bg-border" />
                <div>
                  <div className="text-3xl font-bold gradient-text">0%</div>
                  <div className="text-sm text-muted-foreground">Platform Fee</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <GiftCard3D amount={50} />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">GiftCard</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Traditional crypto gifting is broken. Different chains, tokens, and wallets make it confusing. We fix that.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 hover:glow-purple transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-green-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to gift crypto to anyone, anywhere.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-8 h-full">
                  <div className="text-6xl font-bold text-purple-500/20 mb-4">{step.step}</div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-purple-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-green-500/10" />
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Send a Gift?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                Create your first crypto gift card in under a minute. No account needed.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-lg h-14 px-10">
                <Link href="/create">
                  Create Gift Card Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">GiftCard</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Powered by SideShift API</span>
              <span>|</span>
              <span>Built for cross-chain gifting</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
