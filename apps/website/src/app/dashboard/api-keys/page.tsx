'use client';

import { useEffect, useState } from 'react';

interface ApiKeyInfo {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchKeys = () => {
    fetch(`${API_URL}/v1/api-keys`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setKeys(data.keys ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchKeys(); }, []);

  const createKey = async () => {
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/v1/api-keys`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'Default' }),
      });
      const data = await res.json();
      if (data.key) {
        setCreatedKey(data.key);
        setNewKeyName('');
        fetchKeys();
      }
    } catch {}
    setCreating(false);
  };

  const revokeKey = async (id: string) => {
    await fetch(`${API_URL}/v1/api-keys/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchKeys();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-varman-mist mb-2">API Keys</h1>
      <p className="text-varman-fog text-sm mb-6">
        Generate API keys to connect the ShieldAI extension to your account. Each key links scans to your user for tracking and billing.
      </p>

      {/* Create new key */}
      <div className="bg-varman-steel rounded-xl p-6 mb-6">
        <h2 className="font-display text-lg font-bold text-varman-mist mb-3">Generate New Key</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. 'Work Laptop Chrome')"
            className="flex-1 bg-varman-ink border border-varman-fog/20 rounded-lg px-3 py-2 text-sm text-varman-mist placeholder:text-varman-fog/50"
          />
          <button
            onClick={createKey}
            disabled={creating}
            className="bg-varman-cyan text-varman-ink font-medium px-4 py-2 rounded-lg text-sm hover:bg-varman-cyan/90 disabled:opacity-50"
          >
            {creating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {/* Show newly created key */}
      {createdKey && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 mb-6">
          <h3 className="text-green-400 font-bold text-sm mb-2">Key Created — Copy it now!</h3>
          <p className="text-xs text-varman-fog mb-3">This key will not be shown again. Paste it in your extension settings.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-varman-ink rounded px-3 py-2 text-sm text-green-300 font-mono break-all select-all">
              {createdKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(createdKey); }}
              className="bg-green-700 text-white px-3 py-2 rounded text-xs hover:bg-green-600"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setCreatedKey(null)}
            className="text-xs text-varman-fog mt-3 hover:text-varman-mist"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Existing keys */}
      <div className="bg-varman-steel rounded-xl p-6">
        <h2 className="font-display text-lg font-bold text-varman-mist mb-4">Your Keys</h2>
        {loading ? (
          <div className="animate-pulse h-20 bg-varman-ink rounded" />
        ) : keys.length === 0 ? (
          <p className="text-varman-fog text-sm">No API keys yet. Generate one above to connect your extension.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-varman-fog text-left">
                <th className="pb-2">Name</th>
                <th className="pb-2">Key</th>
                <th className="pb-2">Last Used</th>
                <th className="pb-2">Created</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="text-varman-mist border-t border-varman-ink">
                  <td className="py-3">{k.name}</td>
                  <td className="py-3 font-mono text-xs text-varman-fog">{k.keyPrefix}</td>
                  <td className="py-3 text-xs text-varman-fog">
                    {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3 text-xs text-varman-fog">
                    {new Date(k.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => revokeKey(k.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* How it works */}
      <div className="bg-varman-steel rounded-xl p-6 mt-6">
        <h2 className="font-display text-lg font-bold text-varman-mist mb-3">How Extension Tracking Works</h2>
        <ol className="text-sm text-varman-fog space-y-2 list-decimal list-inside">
          <li>Generate an API key above</li>
          <li>Open the ShieldAI extension → Settings → General → paste the key</li>
          <li>The extension registers itself and sends all scans through your key</li>
          <li>Every scan is linked to your account — visible in Usage &amp; Users pages</li>
          <li>Billing is based on your plan (Free: 50/day, Pro/Team: unlimited)</li>
        </ol>
      </div>
    </div>
  );
}
