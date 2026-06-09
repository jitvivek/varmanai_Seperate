'use client';

import { useEffect, useState } from 'react';

interface UserStats {
  userId: string;
  email: string;
  plan: string;
  totalScans: number;
  threatsBlocked: number;
  extensionInstalls: number;
  browsers: string[];
  lastActive: string | null;
  joinedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function UsersPage() {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/v1/stats/users`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setUsers(data.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Users &amp; Installs</h1>
        <div className="bg-varman-steel rounded-xl p-8 h-64" />
      </div>
    );
  }

  const totalInstalls = users.reduce((acc, u) => acc + u.extensionInstalls, 0);
  const totalScans = users.reduce((acc, u) => acc + u.totalScans, 0);
  const totalBlocked = users.reduce((acc, u) => acc + u.threatsBlocked, 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-varman-mist mb-6">Users &amp; Installs</h1>

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-varman-steel rounded-xl p-4">
          <p className="text-varman-fog text-xs mb-1">Total Users</p>
          <p className="font-display text-2xl text-varman-cyan font-bold">{users.length}</p>
        </div>
        <div className="bg-varman-steel rounded-xl p-4">
          <p className="text-varman-fog text-xs mb-1">Extension Installs</p>
          <p className="font-display text-2xl text-varman-gold font-bold">{totalInstalls}</p>
        </div>
        <div className="bg-varman-steel rounded-xl p-4">
          <p className="text-varman-fog text-xs mb-1">Total Scans</p>
          <p className="font-display text-2xl text-varman-mist font-bold">{totalScans.toLocaleString()}</p>
        </div>
        <div className="bg-varman-steel rounded-xl p-4">
          <p className="text-varman-fog text-xs mb-1">Threats Blocked</p>
          <p className="font-display text-2xl text-varman-danger font-bold">{totalBlocked.toLocaleString()}</p>
        </div>
      </div>

      {/* Per-user table */}
      <div className="bg-varman-steel rounded-xl p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-varman-fog text-left border-b border-varman-ink">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Plan</th>
              <th className="pb-3 pr-4 text-right">Installs</th>
              <th className="pb-3 pr-4">Browsers</th>
              <th className="pb-3 pr-4 text-right">Scans</th>
              <th className="pb-3 pr-4 text-right">Blocked</th>
              <th className="pb-3 pr-4">Last Active</th>
              <th className="pb-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId} className="text-varman-mist border-t border-varman-ink hover:bg-varman-ink-2 transition">
                <td className="py-3 pr-4">
                  <div className="font-medium">{user.email}</div>
                  <div className="text-xs text-varman-fog font-mono">{user.userId.slice(0, 12)}...</div>
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    user.plan === 'pro' ? 'bg-varman-cyan/20 text-varman-cyan' :
                    user.plan === 'team' ? 'bg-varman-gold/20 text-varman-gold' :
                    'bg-varman-fog/20 text-varman-fog'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right font-mono">{user.extensionInstalls}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1">
                    {user.browsers.map((b) => (
                      <span key={b} className="text-xs bg-varman-ink px-1.5 py-0.5 rounded capitalize">{b}</span>
                    ))}
                    {user.browsers.length === 0 && <span className="text-xs text-varman-fog">—</span>}
                  </div>
                </td>
                <td className="py-3 pr-4 text-right font-mono text-varman-cyan">{user.totalScans.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right font-mono text-varman-danger">{user.threatsBlocked.toLocaleString()}</td>
                <td className="py-3 pr-4 text-sm text-varman-fog">
                  {user.lastActive ? new Date(user.lastActive).toLocaleString() : '—'}
                </td>
                <td className="py-3 text-sm text-varman-fog">
                  {new Date(user.joinedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <p className="text-center text-varman-fog py-8">No users found. Users will appear here once they install the extension.</p>
        )}
      </div>
    </div>
  );
}
