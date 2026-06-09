import type { Metadata } from 'next';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with the VarmanAI team. Questions about the product, privacy, billing, or partnerships — we are happy to help.',
};

const EMAILS = [
  {
    address: 'jit.vivek@gmail.com',
    label: 'General & Support',
    note: 'Product questions, support, and general enquiries.',
  },
  {
    address: 'vivekkumar@resee.app',
    label: 'Business & Privacy',
    note: 'Partnerships, billing, and privacy or data requests.',
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-varman-mist mb-3">
            Contact us
          </h1>
          <p className="text-varman-fog text-lg mb-12">
            Have a question, feedback, or a privacy request? Send us an email and we&rsquo;ll get back to you as soon
            as we can.
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            {EMAILS.map((item) => (
              <a
                key={item.address}
                href={`mailto:${item.address}`}
                className="block rounded-2xl border border-varman-steel bg-varman-ink-2 p-6 transition hover:border-varman-cyan"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-varman-steel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#22D3EE" strokeWidth="1.8" />
                      <path d="M4 7l8 6 8-6" stroke="#F5B544" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <h2 className="font-display text-lg font-semibold text-varman-mist">{item.label}</h2>
                </div>
                <p className="text-varman-cyan font-medium break-all">{item.address}</p>
                <p className="text-varman-fog text-sm mt-2">{item.note}</p>
              </a>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-varman-steel p-6">
            <h2 className="font-display text-lg font-semibold text-varman-mist mb-2">Privacy & data requests</h2>
            <p className="text-varman-fog">
              For questions about how we handle your data, please read our{' '}
              <a href="/privacy" className="text-varman-cyan hover:underline">
                Privacy Policy
              </a>
              . To access, export, or delete your data, email us at the addresses above.
            </p>
          </div>

          <p className="text-varman-fog text-sm mt-8">Built in India 🇮🇳 — we typically reply within 1–2 business days.</p>
        </div>
      </section>
      <Footer />
    </>
  );
}
