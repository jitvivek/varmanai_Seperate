const OVERLAY_ID = 'varmanai-shield-overlay';

export function showOverlay(reasons: string[], score: number) {
  removeOverlay();

  const host = document.createElement('div');
  host.id = OVERLAY_ID;
  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    .varman-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(10, 19, 48, 0.85);
      backdrop-filter: blur(4px);
      animation: varman-fade-in 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    @keyframes varman-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .varman-card {
      background: #0f1b3d;
      border: 1px solid #22d3ee;
      border-radius: 16px;
      padding: 32px;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 0 40px rgba(34, 211, 238, 0.15);
    }
    .varman-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .varman-title {
      color: #ef4444;
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .varman-score {
      color: #94a3b8;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .varman-reasons {
      list-style: none;
      padding: 0;
      margin: 0 0 24px;
    }
    .varman-reasons li {
      color: #e2e8f0;
      font-size: 14px;
      padding: 6px 0;
      border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }
    .varman-btn {
      background: #22d3ee;
      color: #0a1330;
      border: none;
      border-radius: 8px;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
    }
    .varman-btn:hover {
      background: #06b6d4;
    }
  `;

  const card = document.createElement('div');
  card.className = 'varman-overlay';
  card.innerHTML = `
    <div class="varman-card">
      <div class="varman-icon">🛡️</div>
      <div class="varman-title">Threat Detected</div>
      <div class="varman-score">Risk Score: ${Math.round(score * 100)}%</div>
      <ul class="varman-reasons">
        ${reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
      </ul>
      <button class="varman-btn" id="varman-dismiss">Dismiss</button>
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(card);
  document.body.appendChild(host);

  shadow.getElementById('varman-dismiss')?.addEventListener('click', removeOverlay);
  setTimeout(removeOverlay, 10000);
}

export function removeOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
}

interface ActionOverlayOptions {
  title: string;
  message: string;
  buttonLabel: string;
  url: string;
}

/**
 * A call-to-action overlay used for "sign in" and "upgrade" prompts. The button
 * opens the given URL in a new tab.
 */
export function showActionOverlay({ title, message, buttonLabel, url }: ActionOverlayOptions) {
  removeOverlay();

  const host = document.createElement('div');
  host.id = OVERLAY_ID;
  const shadow = host.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    .varman-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(10, 19, 48, 0.85);
      backdrop-filter: blur(4px);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .varman-card {
      background: #0f1b3d;
      border: 1px solid #22d3ee;
      border-radius: 16px;
      padding: 32px;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 0 40px rgba(34, 211, 238, 0.15);
    }
    .varman-icon { font-size: 32px; margin-bottom: 12px; }
    .varman-title { color: #22d3ee; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
    .varman-msg { color: #cbd5e1; font-size: 14px; line-height: 1.5; margin-bottom: 24px; }
    .varman-actions { display: flex; gap: 12px; justify-content: center; }
    .varman-btn {
      background: #22d3ee; color: #0a1330; border: none; border-radius: 8px;
      padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer;
    }
    .varman-btn:hover { background: #06b6d4; }
    .varman-btn.secondary { background: transparent; color: #94a3b8; }
  `;

  const card = document.createElement('div');
  card.className = 'varman-overlay';
  card.innerHTML = `
    <div class="varman-card">
      <div class="varman-icon">\u{1F6E1}\uFE0F</div>
      <div class="varman-title">${escapeHtml(title)}</div>
      <div class="varman-msg">${escapeHtml(message)}</div>
      <div class="varman-actions">
        <button class="varman-btn secondary" id="varman-dismiss">Not now</button>
        <button class="varman-btn" id="varman-action">${escapeHtml(buttonLabel)}</button>
      </div>
    </div>
  `;

  shadow.appendChild(style);
  shadow.appendChild(card);
  document.body.appendChild(host);

  shadow.getElementById('varman-dismiss')?.addEventListener('click', removeOverlay);
  shadow.getElementById('varman-action')?.addEventListener('click', () => {
    if (url) chrome.runtime.sendMessage({ type: 'OPEN_TAB', payload: { url } });
    removeOverlay();
  });
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
