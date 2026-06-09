'use client';

import { useEffect, useState } from 'react';

interface Stats {
  overview: {
    totalScans: number;
    threatsBlocked: number;
    scansToday: number;
    extensionInstalls: number;
  };
  installs: Array<{
    id: string;
    browser: string;
    version: string;
    installedAt: string;
    lastActiveAt: string;
  }>;
  scansByDay: Record<string, { total: number; blocked: number }>;
  categoryBreakdown: Record<string, number>;
  siteBreakdown: Record<string, number>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/v1/stats`, { credentials: 'include' })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-varman-steel rounded-xl p-6 h-24" />
          ))}
        </div>
      </div>
    );
  }

  const overview = stats?.overview ?? { totalScans: 0, threatsBlocked: 0, scansToday: 0, extensionInstalls: 0 };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard label="Scans Today" value={overview.scansToday} color="text-varman-cyan" />
        <StatCard label="Total Scans" value={overview.totalScans} color="text-varman-mist" />
        <StatCard label="Threats Blocked" value={overview.threatsBlocked} color="text-varman-danger" />
        <StatCard label="Extension Installs" value={overview.extensionInstalls} color="text-varman-gold" />
      </div>

      {/* Extension installs */}
      {stats?.installs && stats.installs.length > 0 && (
        <div className="bg-varman-steel rounded-xl p-6 mb-8">
          <h2 className="font-display text-xl font-bold text-varman-mist mb-4">Installed Extensions</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-varman-fog text-left">
                <th className="pb-2">Browser</th>
                <th className="pb-2">Version</th>
                <th className="pb-2">Installed</th>
                <th className="pb-2">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {stats.installs.map((install) => (
                <tr key={install.id} className="text-varman-mist border-t border-varman-ink">
                  <td className="py-2 capitalize">{install.browser}</td>
                  <td className="py-2">v{install.version}</td>
                  <td className="py-2">{new Date(install.installedAt).toLocaleDateString()}</td>
                  <td className="py-2">{new Date(install.lastActiveAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Threat categories */}
      {stats?.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-varman-steel rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-varman-mist mb-4">Top Threat Categories</h2>
            <div className="space-y-2">
              {Object.entries(stats.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex justify-between text-sm">
                    <span className="text-varman-fog capitalize">{category.replace(/_/g, ' ')}</span>
                    <span className="text-varman-danger font-mono">{count}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-varman-steel rounded-xl p-6">
            <h2 className="font-display text-xl font-bold text-varman-mist mb-4">Top Sites Scanned</h2>
            <div className="space-y-2">
              {stats.siteBreakdown &&
                Object.entries(stats.siteBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([site, count]) => (
                    <div key={site} className="flex justify-between text-sm">
                      <span className="text-varman-fog">{site}</span>
                      <span className="text-varman-cyan font-mono">{count}</span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      )}

      {/* Scans by day chart (simple bar) */}
      {stats?.scansByDay && Object.keys(stats.scansByDay).length > 0 && (
        <div className="bg-varman-steel rounded-xl p-6 mt-6">
          <h2 className="font-display text-xl font-bold text-varman-mist mb-4">Scans (Last 30 Days)</h2>
          <div className="flex items-end gap-1 h-32">
            {Object.entries(stats.scansByDay)
              .sort(([a], [b]) => a.localeCompare(b))
              .slice(-30)
              .map(([day, data]) => {
                const maxScans = Math.max(...Object.values(stats.scansByDay).map((d) => d.total));
                const height = maxScans > 0 ? (data.total / maxScans) * 100 : 0;
                const blockedHeight = maxScans > 0 ? (data.blocked / maxScans) * 100 : 0;
                return (
                  <div key={day} className="flex-1 relative h-full flex items-end" title={`${day}: ${data.total} scans, ${data.blocked} blocked`}>
                    <div
                      className="w-full bg-varman-cyan rounded-t"
                      style={{ height: `${height}%`, minHeight: data.total > 0 ? '2px' : '0' }}
                    />
                    {data.blocked > 0 && (
                      <div
                        className="w-full bg-varman-danger rounded-t absolute bottom-0"
                        style={{ height: `${blockedHeight}%` }}
                      />
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-varman-steel rounded-xl p-6">
      <p className="text-varman-fog text-sm mb-1">{label}</p>
      <p className={`font-display text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}
