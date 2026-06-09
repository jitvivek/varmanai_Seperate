'use client';

import { useEffect, useState } from 'react';

type Browser = 'chrome' | 'edge' | 'other';

function detectBrowser(): Browser {
  if (typeof navigator === 'undefined') return 'chrome';
  const ua = navigator.userAgent;
  if (ua.includes('Edg/') || ua.includes('Edge/')) return 'edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'chrome';
  return 'other';
}

const STORE_URLS = {
  chrome: process.env.NEXT_PUBLIC_CHROME_STORE_URL ?? '',
  edge: process.env.NEXT_PUBLIC_EDGE_STORE_URL ?? '',
};

const isDevMode = STORE_URLS.chrome.includes('PLACEHOLDER') || !STORE_URLS.chrome;

const EXTENSION_PATH = 'D:\\code\\ShieldAI\\varmanai\\apps\\extension\\dist';

interface Props {
  size?: 'sm' | 'lg';
}

export function AddToBrowserButton({ size = 'sm' }: Props) {
  const [browser, setBrowser] = useState<Browser>('chrome');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  const label = browser === 'edge' ? 'Add to Edge — Free' : 'Add to Chrome — Free';
  const url = browser === 'edge' ? STORE_URLS.edge : STORE_URLS.chrome;

  const sizeClasses = size === 'lg'
    ? 'px-8 py-4 text-base'
    : 'px-4 py-2 text-sm';

  if (browser === 'other') {
    return (
      <span className={`${sizeClasses} rounded-lg bg-varman-steel text-varman-fog cursor-not-allowed`}>
        Chrome or Edge required
      </span>
    );
  }

  function handleClick(e: React.MouseEvent) {
    if (isDevMode) {
      e.preventDefault();
      setShowModal(true);
    }
  }

  const extensionsUrl = browser === 'edge' ? 'edge://extensions' : 'chrome://extensions';

  return (
    <>
      <a
        href={isDevMode ? '#' : url}
        onClick={handleClick}
        className={`${sizeClasses} inline-block rounded-lg bg-varman-cyan text-varman-ink font-bold hover:bg-varman-cyan-deep transition cursor-pointer`}
      >
        {label}
      </a>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-varman-ink-2 border border-varman-steel rounded-2xl max-w-lg w-full p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl text-varman-mist mb-2">Load Extension (Dev Mode)</h2>
            <p className="text-varman-fog text-sm mb-6">
              Since the extension isn&apos;t published to the store yet, load it manually:
            </p>

            <ol className="space-y-4 text-sm text-varman-mist">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-varman-cyan text-varman-ink font-bold flex items-center justify-center text-xs">1</span>
                <div>
                  Open <button onClick={() => { navigator.clipboard.writeText(extensionsUrl); }} className="font-mono text-varman-cyan hover:underline">{extensionsUrl}</button> in your browser
                  <span className="text-varman-fog text-xs block mt-0.5">(Copy-paste into the address bar — links to browser pages are blocked)</span>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-varman-cyan text-varman-ink font-bold flex items-center justify-center text-xs">2</span>
                <span>Enable <strong className="text-varman-gold">&quot;Developer mode&quot;</strong> (toggle in top-right corner)</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-varman-cyan text-varman-ink font-bold flex items-center justify-center text-xs">3</span>
                <span>Click <strong className="text-varman-gold">&quot;Load unpacked&quot;</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-varman-cyan text-varman-ink font-bold flex items-center justify-center text-xs">4</span>
                <div>
                  Select this folder:
                  <div className="mt-1 flex items-center gap-2">
                    <code className="block bg-varman-ink px-3 py-1.5 rounded font-mono text-xs text-varman-cyan break-all">{EXTENSION_PATH}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(EXTENSION_PATH)}
                      className="shrink-0 px-2 py-1.5 rounded bg-varman-steel text-varman-fog hover:text-varman-cyan text-xs transition"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </li>
            </ol>

            <div className="mt-6 pt-4 border-t border-varman-steel flex justify-between items-center">
              <p className="text-varman-fog text-xs">The extension will appear in your toolbar.</p>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-varman-cyan text-varman-ink font-bold text-sm hover:bg-varman-cyan-deep transition"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
