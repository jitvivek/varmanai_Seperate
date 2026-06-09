const ROWS = [
  { feature: 'Hindi detection', varman: true, others: false },
  { feature: 'Hinglish (romanized Hindi)', varman: true, others: false },
  { feature: 'Aadhaar / PAN scanning', varman: true, others: false },
  { feature: 'Works in browser', varman: true, others: 'varies' },
  { feature: 'India pricing (INR/UPI)', varman: true, others: false },
  { feature: 'Free tier', varman: true, others: 'varies' },
];

export function Comparison() {
  return (
    <section className="py-20 px-4 bg-varman-ink-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist text-center mb-12">
          VarmanAI vs generic AI safety tools
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-varman-steel">
                <th className="text-left py-4 px-4 text-varman-fog font-normal">Feature</th>
                <th className="text-center py-4 px-4 text-varman-cyan font-display font-bold">VarmanAI</th>
                <th className="text-center py-4 px-4 text-varman-fog">Others</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-varman-steel/50">
                  <td className="py-3 px-4 text-varman-mist">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-varman-safe text-lg">✓</td>
                  <td className="py-3 px-4 text-center text-varman-danger text-lg">
                    {row.others === true ? '✓' : row.others === 'varies' ? '~' : '✗'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
