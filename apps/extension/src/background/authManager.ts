import type { StoredAuth } from '../shared/types';

export async function getToken(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get('auth');
    const auth = result['auth'] as StoredAuth | undefined;
    if (!auth) return null;
    if (Date.now() > auth.expiresAt) {
      await chrome.storage.local.remove('auth');
      return null;
    }
    return auth.token;
  } catch {
    return null;
  }
}

export async function setToken(token: string, expiresInMs: number = 3600000): Promise<void> {
  try {
    const auth: StoredAuth = {
      token,
      expiresAt: Date.now() + expiresInMs,
    };
    await chrome.storage.local.set({ auth });
  } catch {
    // Storage unavailable
  }
}

/**
 * Store a long-lived API key (sk_shield_...) handed off by the website after
 * sign-in. API keys don't expire like Clerk session tokens, so we use a far
 * future expiry.
 */
export async function setApiKey(key: string): Promise<void> {
  // ~100 years out — effectively non-expiring; revocation is handled server-side.
  await setToken(key, 100 * 365 * 24 * 60 * 60 * 1000);
}

export async function clearToken(): Promise<void> {
  try {
    await chrome.storage.local.remove('auth');
  } catch {
    // Storage unavailable
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}
