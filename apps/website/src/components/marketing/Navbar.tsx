'use client';

import { useEffect, useState } from 'react';
import { AddToBrowserButton } from '@/components/AddToBrowserButton';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-varman-ink/95 backdrop-blur-md border-b border-varman-steel' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2" aria-label="VarmanAI Home">
          <svg width="32" height="32" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M32 4L58 18V46L32 60L6 46V18L32 4Z" stroke="#22D3EE" strokeWidth="3" fill="none" />
            <path d="M22 22L32 44L42 22" stroke="#F5B544" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-xl font-bold text-varman-mist">VarmanAI</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-varman-fog hover:text-varman-mist transition text-sm">Features</a>
          <a href="/pricing" className="text-varman-fog hover:text-varman-mist transition text-sm">Pricing</a>
          <a href="#faq" className="text-varman-fog hover:text-varman-mist transition text-sm">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          <a href="/sign-in" className="text-varman-fog hover:text-varman-mist transition text-sm hidden sm:block">
            Sign in
          </a>
          <AddToBrowserButton size="sm" />
        </div>
      </nav>
    </header>
  );
}
