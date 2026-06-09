interface Props {
  label: string;
  value: number;
}

export default function StatRow({ label, value }: Props) {
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value.toLocaleString()}</span>
    </div>
  );
}
