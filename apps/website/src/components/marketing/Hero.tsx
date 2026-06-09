import { AddToBrowserButton } from '@/components/AddToBrowserButton';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background shield animation */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-[600px] h-[600px]" aria-hidden="true">
          <path d="M200 20L380 110V290L200 380L20 290V110L200 20Z" stroke="#22D3EE" strokeWidth="1" fill="none" />
          <path d="M200 60L340 130V270L200 340L60 270V130L200 60Z" stroke="#22D3EE" strokeWidth="0.5" fill="none" opacity="0.5" />
          <rect x="0" y="0" width="400" height="4" fill="#22D3EE" opacity="0.3" className="animate-scan-line" />
        </svg>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-varman-mist mb-6 leading-tight">
          Armor for your AI.
        </h1>
        <p className="text-lg sm:text-xl text-varman-fog max-w-3xl mx-auto mb-8 leading-relaxed">
          VarmanAI scans every message you send to ChatGPT, Gemini, and Claude — blocking prompt injection,
          harmful content, and data leaks. Built for India, in Hindi, Hinglish &amp; English.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <AddToBrowserButton size="lg" />
          <a
            href="#how-it-works"
            className="px-6 py-3 rounded-lg border border-varman-fog/30 text-varman-mist hover:border-varman-cyan transition font-medium"
          >
            See how it works
          </a>
        </div>

        <p className="text-varman-fog text-sm">
          Free forever for 50 scans/day. No credit card.
        </p>
      </div>
    </section>
  );
}
