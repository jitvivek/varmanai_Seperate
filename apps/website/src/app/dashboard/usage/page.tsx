'use client';

import { useEffect, useState } from 'react';

interface UsageData {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  resetsAt: string;
}

interface Stats {
  scansByDay: Record<string, { total: number; blocked: number }>;
  categoryBreakdown: Record<string, number>;
  siteBreakdown: Record<string, number>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function UsagePage() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/v1/usage`, { credentials: 'include' }).then((r) => r.json()),
      fetch(`${API_URL}/v1/stats`, { credentials: 'include' }).then((r) => r.json()),
    ])
      .then(([usageData, statsData]) => {
        setUsage(usageData);
        setStats(statsData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Usage</h1>
        <div className="bg-varman-steel rounded-xl p-8 h-48" />
      </div>
    );
  }

  const usedPercent = usage && usage.limit > 0 ? Math.min((usage.used / usage.limit) * 100, 100) : 0;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Usage</h1>

      {/* Current plan usage */}
      <div className="bg-varman-steel rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-varman-fog text-sm">Current Plan</p>
            <p className="text-varman-mist font-display text-xl font-bold capitalize">{usage?.plan ?? 'Free'}</p>
          </div>
          <div className="text-right">
            <p className="text-varman-fog text-sm">Resets at</p>
            <p className="text-varman-mist text-sm">{usage?.resetsAt ? new Date(usage.resetsAt).toLocaleString() : '—'}</p>
          </div>
        </div>

        {usage && usage.limit > 0 && (
          <>
            <div className="w-full bg-varman-ink rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition-all ${usedPercent >= 90 ? 'bg-varman-danger' : 'bg-varman-cyan'}`}
                style={{ width: `${usedPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-varman-fog">
              <span>{usage.used} scans used</span>
              <span>{usage.remaining} remaining of {usage.limit}</span>
            </div>
          </>
        )}

        {usage && usage.limit === -1 && (
          <p className="text-varman-cyan text-sm">Unlimited scans (Pro/Team plan)</p>
        )}
      </div>

      {/* Daily breakdown */}
      {stats?.scansByDay && Object.keys(stats.scansByDay).length > 0 && (
        <div className="bg-varman-steel rounded-xl p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-varman-mist mb-4">Daily Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-varman-fog text-left">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Scans</th>
                  <th className="pb-2 text-right">Blocked</th>
                  <th className="pb-2 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.scansByDay)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .slice(0, 14)
                  .map(([day, data]) => (
                    <tr key={day} className="text-varman-mist border-t border-varman-ink">
                      <td className="py-2">{day}</td>
                      <td className="py-2 text-right font-mono">{data.total}</td>
                      <td className="py-2 text-right font-mono text-varman-danger">{data.blocked}</td>
                      <td className="py-2 text-right font-mono text-varman-cyan">
                        {data.total > 0 ? Math.round(((data.total - data.blocked) / data.total) * 100) : 100}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category stats */}
      {stats?.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="bg-varman-steel rounded-xl p-6">
          <h2 className="font-display text-xl font-bold text-varman-mist mb-4">Threat Categories Detected</h2>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => {
                const maxCount = Math.max(...Object.values(stats.categoryBreakdown));
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-varman-fog capitalize">{category.replace(/_/g, ' ')}</span>
                      <span className="text-varman-mist font-mono">{count}</span>
                    </div>
                    <div className="w-full bg-varman-ink rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-varman-danger"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
