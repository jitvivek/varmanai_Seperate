interface Props {
  used: number;
  limit: number;
}

export default function UsageMeter({ used, limit }: Props) {
  const pct = Math.min((used / limit) * 100, 100);
  const isWarning = pct > 80;

  return (
    <div className="usage-meter">
      <div className="usage-labels">
        <span>{used} / {limit} scans</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="usage-bar">
        <div
          className={`usage-fill ${isWarning ? 'warning' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
