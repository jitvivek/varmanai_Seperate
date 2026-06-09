import type { Metadata } from 'next';
import { PricingCards } from '@/components/marketing/PricingCards';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'VarmanAI pricing plans — Free, Pro, and Team. Start protecting your AI interactions for free with 50 scans/day.',
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-varman-mist mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-varman-fog text-lg">
            Start free. Upgrade when you need unlimited protection.
          </p>
        </div>
        <PricingCards />
      </section>
      <Footer />
    </>
  );
}
