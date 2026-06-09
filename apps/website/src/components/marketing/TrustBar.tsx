'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 50000, label: 'prompts scanned', suffix: '+' },
  { value: 250, label: 'attack patterns', suffix: '+' },
  { value: 5, label: 'languages', suffix: '' },
  { value: 60, label: 'ms scan time', prefix: '<' },
];

export function TrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry?.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-12 border-y border-varman-steel bg-varman-ink-2">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-3xl md:text-4xl font-bold text-varman-cyan">
              {stat.prefix ?? ''}{visible ? stat.value.toLocaleString() : '0'}{stat.suffix ?? ''}
            </p>
            <p className="text-varman-fog text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
