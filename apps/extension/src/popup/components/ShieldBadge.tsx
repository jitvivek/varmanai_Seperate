interface Props {
  active: boolean;
}

export default function ShieldBadge({ active }: Props) {
  return (
    <div className={`shield-badge ${active ? 'active' : 'inactive'}`}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
          fill={active ? '#22d3ee' : '#64748b'}
          opacity="0.2"
        />
        <path
          d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
          stroke={active ? '#22d3ee' : '#64748b'}
          strokeWidth="1.5"
          fill="none"
        />
        {active && (
          <path d="M9 12l2 2 4-4" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
}
