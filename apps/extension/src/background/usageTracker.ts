import { DAILY_FREE_LIMIT } from '../shared/constants';
import type { StoredUsage } from '../shared/types';

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getLocalUsage(): Promise<StoredUsage> {
  try {
    const result = await chrome.storage.local.get('usage');
    const usage = result['usage'] as StoredUsage | undefined;
    if (!usage || usage.date !== getToday()) {
      return { used: 0, limit: DAILY_FREE_LIMIT, date: getToday() };
    }
    return usage;
  } catch {
    return { used: 0, limit: DAILY_FREE_LIMIT, date: getToday() };
  }
}

export async function incrementLocalUsage(): Promise<StoredUsage> {
  const current = await getLocalUsage();
  const updated: StoredUsage = {
    used: current.used + 1,
    limit: current.limit,
    date: getToday(),
  };
  try {
    await chrome.storage.local.set({ usage: updated });
  } catch {
    // Storage unavailable
  }
  return updated;
}

export async function updateUsageFromServer(used: number, limit: number): Promise<void> {
  try {
    const usage: StoredUsage = { used, limit, date: getToday() };
    await chrome.storage.local.set({ usage });
  } catch {
    // Storage unavailable
  }
}
