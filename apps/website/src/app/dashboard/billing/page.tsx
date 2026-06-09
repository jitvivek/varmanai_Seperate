export default function BillingPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Billing</h1>
      <div className="bg-varman-steel rounded-xl p-8">
        <h2 className="font-display text-xl text-varman-mist mb-4">Current Plan: Free</h2>
        <p className="text-varman-fog mb-6">50 scans/day included. Upgrade to Pro for unlimited scans.</p>
        <button className="bg-varman-cyan text-varman-ink font-bold px-6 py-3 rounded-lg hover:bg-varman-cyan-deep transition">
          Upgrade to Pro — ₹199/mo
        </button>
      </div>
    </div>
  );
}
