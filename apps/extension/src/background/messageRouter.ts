import type { ExtensionMessage } from '../shared/messages';
import { detect } from '@varmanai/core';
import { apiDetect, UsageLimitError } from './apiClient';
import { isAuthenticated, setApiKey, clearToken } from './authManager';
import { getLocalUsage, incrementLocalUsage, updateUsageFromServer } from './usageTracker';
import { updateBadge } from './badgeManager';
import { ANON_FREE_LIMIT, BILLING_URL, CONNECT_URL } from '../shared/constants';

// Throttle tab-opening so a user who keeps typing past their limit isn't spammed
// with new tabs. Reset when the user signs in / out.
let billingTabOpened = false;
let connectTabOpened = false;

async function openOnce(url: string, kind: 'billing' | 'connect'): Promise<void> {
  if (kind === 'billing' && billingTabOpened) return;
  if (kind === 'connect' && connectTabOpened) return;
  if (kind === 'billing') billingTabOpened = true;
  else connectTabOpened = true;
  try {
    await chrome.tabs.create({ url });
  } catch {
    // Tabs API unavailable — ignore.
  }
}

chrome.runtime.onMessage.addListener(
  (message: ExtensionMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response?: unknown) => void) => {
    handleMessage(message).then(sendResponse).catch(() => sendResponse(null));
    return true; // Keep channel open for async
  }
);

async function handleMessage(message: ExtensionMessage): Promise<unknown> {
  switch (message.type) {
    case 'SCAN_TEXT':
      return handleScan(message.payload.text, message.payload.site);
    case 'GET_STATUS':
      return handleGetStatus();
    case 'AUTH_TOKEN':
      // API key handed off by the website connect page after sign-in.
      await setApiKey(message.payload.token);
      billingTabOpened = false;
      connectTabOpened = false;
      return { success: true };
    case 'SIGN_OUT':
      await clearToken();
      billingTabOpened = false;
      connectTabOpened = false;
      return { success: true };
    case 'OPEN_TAB':
      try {
        await chrome.tabs.create({ url: message.payload.url });
      } catch {
        // Tabs API unavailable — ignore.
      }
      return { success: true };
    default:
      return null;
  }
}

async function handleScan(text: string, site: string) {
  const authenticated = await isAuthenticated();

  // Signed-in: scan via backend so usage is tracked against the user account.
  if (authenticated) {
    try {
      const result = await apiDetect(text, site);
      if (result.usage) {
        await updateUsageFromServer(result.usage.used, result.usage.limit);
      }
      updateBadge(result.verdict);
      return { type: 'SCAN_RESULT', payload: result };
    } catch (err: unknown) {
      if (err instanceof UsageLimitError) {
        // Daily limit reached — send the user to checkout, keep them protected
        // with a local scan in the meantime.
        await openOnce(err.upgradeUrl ?? BILLING_URL, 'billing');
        const localResult = detect(text);
        updateBadge(localResult.verdict);
        return {
          type: 'SCAN_RESULT',
          payload: { ...localResult, limitExceeded: true, upgradeUrl: err.upgradeUrl ?? BILLING_URL },
        };
      }
      // Network/other error — fall through to local scan below.
    }

    const localResult = detect(text);
    updateBadge(localResult.verdict);
    return { type: 'SCAN_RESULT', payload: { ...localResult, offline: true } };
  }

  // Signed-out: allow a small anonymous quota, then prompt sign-in so usage can
  // be attributed to a real account.
  const usage = await getLocalUsage();
  if (usage.used >= ANON_FREE_LIMIT) {
    await openOnce(CONNECT_URL, 'connect');
    return {
      type: 'SCAN_RESULT',
      payload: { verdict: 'safe', requiresAuth: true, connectUrl: CONNECT_URL },
    };
  }

  const localResult = detect(text);
  await incrementLocalUsage();
  updateBadge(localResult.verdict);
  return { type: 'SCAN_RESULT', payload: { ...localResult, offline: true } };
}

async function handleGetStatus() {
  const authenticated = await isAuthenticated();
  const usage = await getLocalUsage();
  const anonLimit = authenticated ? usage.limit : ANON_FREE_LIMIT;

  let online = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}/v1/health`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    online = res.ok;
  } catch {
    online = false;
  }

  return {
    type: 'STATUS_RESPONSE',
    payload: {
      authenticated,
      online,
      connectUrl: CONNECT_URL,
      billingUrl: BILLING_URL,
      usage: { used: usage.used, limit: anonLimit, remaining: Math.max(0, anonLimit - usage.used) },
    },
  };
}
