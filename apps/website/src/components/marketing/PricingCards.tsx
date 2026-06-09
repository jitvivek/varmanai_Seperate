'use client';

import { useState } from 'react';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    description: '50 scans/day',
    features: ['50 scans/day', 'Injection detection', 'Basic harmful content filter', 'English + Hindi', 'Community support'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: { monthly: 199, annual: 159 },
    description: 'Unlimited scans',
    features: ['Unlimited scans', 'Full PII protection (Aadhaar/PAN/UPI)', 'All languages (Hindi/Hinglish/Tamil)', 'Advanced injection + jailbreak detection', 'Usage dashboard', 'Email support'],
    cta: 'Upgrade to Pro',
    highlighted: true,
  },
  {
    name: 'Team',
    price: { monthly: 149, annual: 119 },
    description: 'Per user/month (min 5 seats)',
    features: ['Everything in Pro', 'Centralized admin dashboard', 'Group deployment', 'Custom block rules', 'Priority support', 'DPDP compliance logs'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function PricingCards() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist text-center mb-4">
          Simple pricing in ₹
        </h2>
        <p className="text-varman-fog text-center mb-8">Start free. Pay only when you need more.</p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm ${!annual ? 'text-varman-mist' : 'text-varman-fog'}`}>Monthly</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-12 h-6 rounded-full transition ${annual ? 'bg-varman-cyan' : 'bg-varman-steel'}`}
            aria-label="Toggle annual billing"
          >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${annual ? 'left-7' : 'left-1'}`} />
          </button>
          <span className={`text-sm ${annual ? 'text-varman-mist' : 'text-varman-fog'}`}>
            Annual <span className="text-varman-gold text-xs">(20% off)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? 'border-varman-cyan bg-varman-steel/50 ring-1 ring-varman-cyan/30'
                  : 'border-varman-steel bg-varman-ink-2'
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block bg-varman-cyan/10 text-varman-cyan text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold text-varman-mist">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <span className="font-display text-4xl font-bold text-varman-mist">
                  ₹{annual ? plan.price.annual : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && <span className="text-varman-fog text-sm">/mo</span>}
              </div>
              <p className="text-varman-fog text-sm mb-6">{plan.description}</p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-varman-mist">
                    <span className="text-varman-safe mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-bold transition ${
                  plan.highlighted
                    ? 'bg-varman-cyan text-varman-ink hover:bg-varman-cyan-deep'
                    : 'border border-varman-steel text-varman-mist hover:border-varman-cyan'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
