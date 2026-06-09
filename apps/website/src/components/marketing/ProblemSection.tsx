const PROBLEMS = [
  {
    icon: '🔓',
    title: 'Your data leaks',
    description: 'People paste Aadhaar numbers, PAN cards, passwords, and private data into AI chatbots every day.',
  },
  {
    icon: '💉',
    title: 'Prompt injection',
    description: 'Malicious instructions hidden in text hijack AI behavior — bypassing safety guardrails.',
  },
  {
    icon: '⚠️',
    title: 'Harmful content',
    description: 'Kids and employees can access dangerous information through AI — weapons, drugs, self-harm.',
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-varman-mist text-center mb-4">
          The hidden risk in every AI chat
        </h2>
        <p className="text-varman-fog text-center mb-12 max-w-2xl mx-auto">
          Every time you type into ChatGPT, Gemini, or Claude, you&apos;re one message away from a data breach.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROBLEMS.map((problem) => (
            <div
              key={problem.title}
              className="bg-varman-steel/50 border border-varman-steel rounded-xl p-8 hover:border-varman-cyan/30 transition"
            >
              <div className="text-4xl mb-4" aria-hidden="true">{problem.icon}</div>
              <h3 className="font-display text-xl font-semibold text-varman-mist mb-2">{problem.title}</h3>
              <p className="text-varman-fog text-sm leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
