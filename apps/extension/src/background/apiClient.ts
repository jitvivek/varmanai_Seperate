import { API_URL } from '../shared/constants';
import type { DetectionResult } from '@varmanai/core';
import { getToken } from './authManager';

interface DetectResponse extends DetectionResult {
  usage: { used: number; limit: number; remaining: number };
}

/** Thrown when the backend rejects a scan because the daily limit is reached. */
export class UsageLimitError extends Error {
  readonly upgradeUrl?: string;
  constructor(upgradeUrl?: string) {
    super('USAGE_LIMIT_EXCEEDED');
    this.name = 'UsageLimitError';
    this.upgradeUrl = upgradeUrl;
  }
}

export async function apiDetect(text: string, site: string): Promise<DetectResponse> {
  const token = await getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_URL}/v1/detect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text, site }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      const body = await response.json().catch(() => ({})) as {
        error?: { code?: string };
        upgrade_url?: string;
      };
      if (body.error?.code === 'USAGE_LIMIT_EXCEEDED') {
        throw new UsageLimitError(body.upgrade_url);
      }
      throw new Error(body.error?.code ?? 'RATE_LIMITED');
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json() as DetectResponse;
  } finally {
    clearTimeout(timeout);
  }
}

export async function apiGetUsage(): Promise<{ used: number; limit: number; remaining: number }> {
  const token = await getToken();
  if (!token) {
    return { used: 0, limit: 50, remaining: 50 };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_URL}/v1/usage`, {
      headers: { 'Authorization': `Bearer ${token}` },
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Usage API error: ${response.status}`);
    const data = await response.json() as { used: number; limit: number; remaining: number };
    return data;
  } catch {
    return { used: 0, limit: 50, remaining: 50 };
  } finally {
    clearTimeout(timeout);
  }
}
