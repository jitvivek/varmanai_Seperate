'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const PAGE_SOURCE = 'varmanai-connect';
const EXT_SOURCE = 'varmanai-extension';

type Phase = 'connecting' | 'connected' | 'no-extension' | 'error';

interface Props {
  /** Returns a Clerk session token, or null in dev mode (backend bypass). */
  getToken: () => Promise<string | null>;
}

/**
 * Mints an extension API key from the backend and hands it to the installed
 * extension via window.postMessage (picked up by the extension's content-script
 * bridge). Works without knowing the extension ID.
 */
export default function ConnectPanel({ getToken }: Props) {
  const [phase, setPhase] = useState<Phase>('connecting');
  const [error, setError] = useState('');
  const presentRef = useRef(false);

  // Listen for the extension announcing itself / acknowledging the handoff.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.source !== window) return;
      if (e.origin !== window.location.origin) return;
      const data = e.data as { source?: string; type?: string } | null;
      if (!data || data.source !== EXT_SOURCE) return;
      if (data.type === 'PRESENT') presentRef.current = true;
      if (data.type === 'CONNECTED') setPhase('connected');
    }
    window.addEventListener('message', onMessage);
    // Ask the bridge to re-announce in case it loaded before this listener.
    window.postMessage({ source: PAGE_SOURCE, type: 'PING' }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const connect = useCallback(async () => {
    setPhase('connecting');
    setError('');
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/v1/extension/connect`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: { message?: string } }
          | null;
        throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as { apiKey?: string };
      if (!data.apiKey) throw new Error('Server did not return an API key.');

      // Hand the key to the extension's content-script bridge.
      window.postMessage(
        { source: PAGE_SOURCE, type: 'CONNECT', token: data.apiKey },
        window.location.origin,
      );

      // Wait briefly for the extension to acknowledge (CONNECTED). If it never
      // announced itself, it's probably not installed.
      window.setTimeout(() => {
        setPhase((p) => (p !== 'connecting' ? p : presentRef.current ? 'connected' : 'no-extension'));
      }, 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Connection failed.');
      setPhase('error');
    }
  }, [getToken]);

  // Kick off automatically on mount.
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void connect();
  }, [connect]);

  return (
    <div className="w-full max-w-md rounded-2xl border border-varman-steel bg-varman-ink-2 p-8 text-center shadow-2xl">
      {phase === 'connecting' && (
        <>
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-varman-steel border-t-varman-cyan" />
          <h1 className="font-display text-2xl text-varman-mist">Connecting your extension…</h1>
          <p className="mt-2 text-sm text-varman-fog">Linking this browser to your VarmanAI account.</p>
        </>
      )}

      {phase === 'connected' && (
        <>
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-varman-cyan/15 text-2xl">✓</div>
          <h1 className="font-display text-2xl text-varman-mist">Extension connected</h1>
          <p className="mt-2 text-sm text-varman-fog">
            Your scans are now tracked under your account. You can close this tab and start using VarmanAI.
          </p>
        </>
      )}

      {phase === 'no-extension' && (
        <>
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-varman-gold/15 text-2xl">!</div>
          <h1 className="font-display text-2xl text-varman-mist">Almost there</h1>
          <p className="mt-2 text-sm text-varman-fog">
            We couldn&apos;t detect the VarmanAI extension. Install it from your browser store, then reopen this page to finish connecting.
          </p>
          <button
            onClick={() => void connect()}
            className="mt-5 rounded-lg bg-varman-cyan px-5 py-2.5 text-sm font-bold text-varman-ink transition hover:bg-varman-cyan-deep"
          >
            Try again
          </button>
        </>
      )}

      {phase === 'error' && (
        <>
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/15 text-2xl">×</div>
          <h1 className="font-display text-2xl text-varman-mist">Couldn&apos;t connect</h1>
          <p className="mt-2 text-sm text-varman-fog">{error}</p>
          <button
            onClick={() => void connect()}
            className="mt-5 rounded-lg bg-varman-cyan px-5 py-2.5 text-sm font-bold text-varman-ink transition hover:bg-varman-cyan-deep"
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
}
