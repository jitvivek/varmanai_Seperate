import { useEffect, useState } from 'react';
import ShieldBadge from './components/ShieldBadge';
import UsageMeter from './components/UsageMeter';
import StatRow from './components/StatRow';

interface StatusData {
  authenticated: boolean;
  online: boolean;
  connectUrl: string;
  billingUrl: string;
  usage: { used: number; limit: number; remaining: number };
}

export default function App() {
  const [status, setStatus] = useState<StatusData | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (res: { payload?: StatusData } | null) => {
      if (res?.payload) setStatus(res.payload);
    });
  }, []);

  const openTab = (url: string) => chrome.tabs.create({ url });

  const signOut = () => {
    chrome.runtime.sendMessage({ type: 'SIGN_OUT' }, () => window.close());
  };

  if (!status) {
    return (
      <div className="popup-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const { authenticated, online, usage, connectUrl, billingUrl } = status;

  return (
    <div className="popup-container">
      <header className="popup-header">
        <ShieldBadge active={authenticated} />
        <div>
          <h1 className="popup-title">VarmanAI</h1>
          <span className="popup-plan">{authenticated ? 'Signed in' : 'Not signed in'}</span>
        </div>
        <span className={`toggle-btn ${online ? 'active' : ''}`}>{online ? 'ONLINE' : 'OFFLINE'}</span>
      </header>

      <UsageMeter used={usage.used} limit={usage.limit} />

      <div className="stats">
        <StatRow label="Scans Used" value={usage.used} />
        <StatRow label="Remaining" value={usage.remaining} />
        <StatRow label="Daily Limit" value={usage.limit} />
      </div>

      {!authenticated ? (
        <>
          <p className="popup-hint">
            Sign in to track your usage across devices and unlock cloud detection.
          </p>
          <button className="upgrade-btn" onClick={() => openTab(connectUrl)}>
            Sign in / Connect account
          </button>
        </>
      ) : (
        <>
          <button className="upgrade-btn" onClick={() => openTab(billingUrl)}>
            Upgrade to Pro
          </button>
          <button className="text-btn" onClick={signOut}>
            Sign out
          </button>
        </>
      )}
    </div>
  );
}
