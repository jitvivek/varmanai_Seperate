const FEATURES = [
  { icon: '⚡', title: 'Real-time scanning', description: 'Every message scanned in <60ms before it reaches the AI.' },
  { icon: '🇮🇳', title: 'Indian PII protection', description: 'Detects Aadhaar, PAN, UPI IDs, and Indian phone numbers.' },
  { icon: '🗣️', title: 'Multilingual detection', description: 'Hindi, Hinglish, Tamil — attacks in Indian languages caught.' },
  { icon: '🛡️', title: 'Prompt injection defense', description: '250+ patterns for jailbreaks, DAN, roleplay exploits.' },
  { icon: '🌐', title: 'Works on all AI sites', description: 'ChatGPT, Gemini, Claude, Copilot, Perplexity — one extension.' },
  { icon: '🔒', title: 'Privacy-first', description: 'Your data is never stored. Only hashes for analytics. Zero-knowledge.' },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-4 bg-varman-ink-2">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist text-center mb-12">
          Built to protect you
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-varman-ink border border-varman-steel rounded-xl p-6 hover:border-varman-cyan/30 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-3xl mb-3" aria-hidden="true">{feature.icon}</div>
              <h3 className="font-display text-lg font-semibold text-varman-mist mb-2">{feature.title}</h3>
              <p className="text-varman-fog text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
