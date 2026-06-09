import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { TrustBar } from '@/components/marketing/TrustBar';
import { ProblemSection } from '@/components/marketing/ProblemSection';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { LiveDemo } from '@/components/marketing/LiveDemo';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { LanguageShowcase } from '@/components/marketing/LanguageShowcase';
import { Comparison } from '@/components/marketing/Comparison';
import { PricingCards } from '@/components/marketing/PricingCards';
import { FAQ } from '@/components/marketing/FAQ';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <HowItWorks />
      <LiveDemo />
      <FeatureGrid />
      <LanguageShowcase />
      <Comparison />
      <PricingCards />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  );
}
