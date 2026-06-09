import type { SiteAdapter } from './adapters/base';
import { chatgptAdapter } from './adapters/chatgpt';
import { geminiAdapter } from './adapters/gemini';
import { claudeAdapter } from './adapters/claude';
import { copilotAdapter } from './adapters/copilot';
import { perplexityAdapter } from './adapters/perplexity';
import { genericAdapter } from './adapters/generic';
import { showOverlay, showActionOverlay } from './overlay';

interface ScanResultPayload {
  verdict?: 'safe' | 'suspicious' | 'malicious';
  riskScore?: number;
  explanation?: string;
  matchedRules?: string[];
  requiresAuth?: boolean;
  connectUrl?: string;
  limitExceeded?: boolean;
  upgradeUrl?: string;
}

function getAdapter(): SiteAdapter {
  const host = window.location.hostname;
  if (host.includes('chat.openai.com') || host.includes('chatgpt.com')) return chatgptAdapter;
  if (host.includes('gemini.google.com')) return geminiAdapter;
  if (host.includes('claude.ai')) return claudeAdapter;
  if (host.includes('copilot.microsoft.com')) return copilotAdapter;
  if (host.includes('perplexity.ai')) return perplexityAdapter;
  return genericAdapter;
}

let isScanning = false;

async function scanAndBlock(text: string, adapter: SiteAdapter): Promise<boolean> {
  if (isScanning || !text.trim()) return false;
  isScanning = true;

  try {
    const response = await chrome.runtime.sendMessage({
      type: 'SCAN_TEXT',
      payload: { text, site: adapter.name },
    }) as { type?: string; payload?: ScanResultPayload } | null;

    const result = response?.payload;
    if (!result) return false;

    // Signed-out user has used up their anonymous quota — prompt sign-in.
    if (result.requiresAuth) {
      showActionOverlay({
        title: 'Sign in to keep scanning',
        message: 'You\u2019ve used your free anonymous scans. Sign in to continue protecting your prompts and track usage across devices.',
        buttonLabel: 'Sign in / Connect account',
        url: result.connectUrl ?? '',
      });
      return true;
    }

    const isThreat = result.verdict === 'malicious' || result.verdict === 'suspicious';
    if (isThreat) {
      const reasons = result.explanation
        ? [result.explanation]
        : (result.matchedRules && result.matchedRules.length > 0
            ? result.matchedRules
            : ['Potential prompt injection detected']);
      showOverlay(reasons, result.riskScore ?? 0);
    }

    // Daily limit hit — the prompt was still scanned locally, but nudge upgrade.
    if (result.limitExceeded) {
      showActionOverlay({
        title: 'Daily limit reached',
        message: 'You\u2019ve hit your free daily scan limit. Upgrade to Pro for unlimited cloud-powered protection.',
        buttonLabel: 'Upgrade to Pro',
        url: result.upgradeUrl ?? '',
      });
    }

    return isThreat;
  } catch {
    return false;
  } finally {
    isScanning = false;
  }
}

export function setupInterceptor() {
  const adapter = getAdapter();

  // Intercept Enter key
  document.addEventListener(
    'keydown',
    async (e) => {
      if (e.key !== 'Enter' || e.shiftKey || e.ctrlKey || e.altKey) return;

      const input = adapter.getInputElement();
      if (!input) return;

      const text = adapter.getInputText(input);
      if (!text.trim()) return;

      e.preventDefault();
      e.stopImmediatePropagation();

      const blocked = await scanAndBlock(text, adapter);
      if (!blocked) {
        // Re-dispatch Enter
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true,
        });
        input.dispatchEvent(enterEvent);
      }
    },
    true
  );

  // Intercept send button click
  const sendBtn = adapter.getSendButton();
  if (sendBtn) {
    sendBtn.addEventListener(
      'click',
      async (e) => {
        const input = adapter.getInputElement();
        if (!input) return;

        const text = adapter.getInputText(input);
        if (!text.trim()) return;

        e.preventDefault();
        e.stopImmediatePropagation();

        await scanAndBlock(text, adapter);
      },
      true
    );
  }
}
