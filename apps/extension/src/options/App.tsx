import { useEffect, useState } from 'react';
import { CONNECT_URL, BILLING_URL } from '../shared/constants';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { type: 'GET_STATUS' },
      (res: { payload?: { authenticated: boolean } } | null) => {
        if (res?.payload) setAuthenticated(res.payload.authenticated);
      },
    );
  }, []);

  const saveKey = () => {
    if (!apiKey.trim()) return;
    chrome.runtime.sendMessage({ type: 'AUTH_TOKEN', payload: { token: apiKey.trim() } }, () => {
      setSaved(true);
      setAuthenticated(true);
      setApiKey('');
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const signOut = () => {
    chrome.runtime.sendMessage({ type: 'SIGN_OUT' }, () => setAuthenticated(false));
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif', color: '#e2e8f0', background: '#0a1330', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: '#f8fafc' }}>VarmanAI Settings</h1>
      <p style={{ color: '#94a3b8', marginBottom: 32, fontSize: 14 }}>
        Status: <strong style={{ color: authenticated ? '#22d3ee' : '#f59e0b' }}>{authenticated ? 'Connected' : 'Not connected'}</strong>
      </p>

      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Connect your account</h2>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Sign in with email or Google to link this extension to your VarmanAI account. Your usage is then tracked across devices.
        </p>
        <a
          href={CONNECT_URL}
          target="_blank"
          rel="noopener"
          style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 8, background: '#22d3ee', color: '#0a1330', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}
        >
          Sign in / Connect account
        </a>
      </div>

      <details style={{ marginBottom: 32 }}>
        <summary style={{ cursor: 'pointer', color: '#94a3b8', fontSize: 13 }}>Advanced: paste an API key manually</summary>
        <div style={{ marginTop: 16 }}>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_shield_..."
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #334155', background: '#0f1b3d', color: '#f8fafc', fontSize: 14, marginBottom: 12 }}
          />
          <button
            onClick={saveKey}
            style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#22d3ee', color: '#0a1330', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}
          >
            {saved ? '\u2713 Saved' : 'Save key'}
          </button>
        </div>
      </details>

      <div style={{ paddingTop: 24, borderTop: '1px solid #1e293b' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Subscription</h2>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Manage your plan and upgrade at{' '}
          <a href={BILLING_URL} target="_blank" rel="noopener" style={{ color: '#22d3ee' }}>your billing page</a>.
        </p>
        {authenticated && (
          <button
            onClick={signOut}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontSize: 13, cursor: 'pointer' }}
          >
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}
