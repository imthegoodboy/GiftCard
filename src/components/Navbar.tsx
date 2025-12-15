"use client";

import Link from 'next/link';
import { Gift, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">GiftCard</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
              Create Gift
            </Link>
            <Link href="/track" className="text-muted-foreground hover:text-foreground transition-colors">
              Track Gift
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600">
              <Link href="/create">
                Create Gift Card
              </Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link 
              href="/" 
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/create" 
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Create Gift
            </Link>
            <Link 
              href="/track" 
              className="block px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Track Gift
            </Link>
            <div className="px-4 pt-2">
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-green-500">
                <Link href="/create" onClick={() => setIsOpen(false)}>
                  Create Gift Card
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
