'use client';

import { useState } from 'react';

const FAQS = [
  { q: 'Is VarmanAI free?', a: 'Yes! The free tier gives you 50 scans per day with injection detection and basic harmful content filtering. No credit card required.' },
  { q: 'How does it protect my privacy?', a: 'VarmanAI never stores your text. We only hash your input for analytics. The scan runs locally for basic detection, and the backend only receives text for analysis — never persisting the raw content.' },
  { q: 'Does it work on ChatGPT?', a: 'Yes. VarmanAI works on ChatGPT, Gemini, Claude, Microsoft Copilot, and Perplexity. We intercept messages before they\'re sent to the AI.' },
  { q: 'What languages does it support?', a: 'English, Hindi (Devanagari), Hinglish (romanized Hindi), Tamil, and more coming. We\'re the only tool that detects prompt injection in Indian languages.' },
  { q: 'Does it slow down my browser?', a: 'No. Scans take <60ms. The extension is lightweight and only activates on supported AI sites. It has zero impact on other websites.' },
  { q: 'Can my data be seen by VarmanAI?', a: 'No. We use a zero-knowledge architecture. Text is scanned in real-time and discarded. Only a SHA-256 hash is logged for usage analytics.' },
  { q: 'How do I cancel?', a: 'Go to Dashboard → Billing → Cancel. Your plan will remain active until the end of the billing cycle. No questions asked.' },
  { q: 'Does it work on Edge?', a: 'Yes! VarmanAI is available on both Chrome Web Store and Microsoft Edge Add-ons. Same features, same protection.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist text-center mb-12">
          Frequently asked questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border border-varman-steel rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
                aria-expanded={open === i}
              >
                <span className="text-varman-mist font-medium">{faq.q}</span>
                <span className={`text-varman-cyan transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              {open === i && (
                <div className="px-6 pb-4">
                  <p className="text-varman-fog text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
