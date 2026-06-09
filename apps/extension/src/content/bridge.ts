/**
 * Connect bridge — runs only on the VarmanAI "connect" page (see manifest
 * content_scripts match). It lets the website hand a freshly minted API key to
 * the extension without the site needing to know the extension ID.
 *
 * Flow:
 *   1. On load, announce the extension is present so the page can show
 *      "connect" instead of "install".
 *   2. When the page posts a CONNECT message with the user's API key, store it
 *      in the extension and acknowledge with CONNECTED.
 */

const PAGE_SOURCE = 'varmanai-connect';
const EXT_SOURCE = 'varmanai-extension';

function announcePresence(): void {
  window.postMessage({ source: EXT_SOURCE, type: 'PRESENT' }, window.location.origin);
}

window.addEventListener('message', (event: MessageEvent) => {
  // Only trust messages from this same page (content scripts share the window).
  if (event.source !== window) return;
  if (event.origin !== window.location.origin) return;

  const data = event.data as { source?: string; type?: string; token?: string } | null;
  if (!data || data.source !== PAGE_SOURCE) return;

  if (data.type === 'PING') {
    announcePresence();
    return;
  }

  if (data.type === 'CONNECT' && typeof data.token === 'string' && data.token) {
    chrome.runtime.sendMessage(
      { type: 'AUTH_TOKEN', payload: { token: data.token } },
      () => {
        window.postMessage({ source: EXT_SOURCE, type: 'CONNECTED' }, window.location.origin);
      },
    );
  }
});

announcePresence();
