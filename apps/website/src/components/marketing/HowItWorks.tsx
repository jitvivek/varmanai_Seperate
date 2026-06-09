const STEPS = [
  { number: '1', title: 'Install the extension', description: 'One click from Chrome Web Store or Edge Add-ons.' },
  { number: '2', title: 'Browse AI sites normally', description: 'Use ChatGPT, Gemini, Claude as you always do.' },
  { number: '3', title: 'VarmanAI scans & blocks threats', description: 'Every message is scanned in real-time before it\'s sent.' },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-varman-ink-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist text-center mb-16">
          How it works
        </h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-varman-steel hidden md:block" aria-hidden="true" />

          <div className="space-y-12">
            {STEPS.map((step) => (
              <div key={step.number} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-varman-cyan/10 border-2 border-varman-cyan flex items-center justify-center">
                  <span className="font-display text-xl font-bold text-varman-cyan">{step.number}</span>
                </div>
                <div className="pt-3">
                  <h3 className="font-display text-xl font-semibold text-varman-mist mb-1">{step.title}</h3>
                  <p className="text-varman-fog">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
