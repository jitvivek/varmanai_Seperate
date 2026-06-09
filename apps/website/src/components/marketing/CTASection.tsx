import { AddToBrowserButton } from '@/components/AddToBrowserButton';

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-varman-ink-2">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist mb-4">
          Add VarmanAI to your browser in 10 seconds
        </h2>
        <p className="text-varman-fog mb-8">
          Free forever for 50 scans/day. No signup required for basic protection.
        </p>
        <AddToBrowserButton size="lg" />
      </div>
    </section>
  );
}
