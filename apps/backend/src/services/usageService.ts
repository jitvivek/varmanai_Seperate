import { redis } from '../config/redis.js';
import type { UsageResult } from '@varmanai/core';

const PLANS: Record<string, { scansPerDay: number | null }> = {
  free: { scansPerDay: 50 },
  pro: { scansPerDay: null },
  team: { scansPerDay: null },
};

export async function checkAndIncrementUsage(userId: string, plan: string): Promise<UsageResult> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `usage:${userId}:${today}`;
  const planConfig = PLANS[plan] ?? PLANS['free'];
  const limit = planConfig?.scansPerDay ?? 50;

  if (limit === null || plan === 'pro' || plan === 'team') {
    // Paid plan — still count for analytics but never block
    await redis.incr(key);
    await redis.expire(key, 90000);
    return { allowed: true, used: -1, limit: -1, remaining: -1 };
  }

  // ATOMIC: increment first, then check
  const used = await redis.incr(key);
  if (used === 1) {
    await redis.expire(key, 90000);
  }

  if (used > limit) {
    // Over limit — decrement back to reflect reality
    await redis.decr(key);
    return { allowed: false, used: limit, limit, remaining: 0 };
  }

  return { allowed: true, used, limit, remaining: limit - used };
}

export async function getCurrentUsage(userId: string, plan: string): Promise<UsageResult> {
  const today = new Date().toISOString().slice(0, 10);
  const key = `usage:${userId}:${today}`;
  const planConfig = PLANS[plan] ?? PLANS['free'];
  const limit = planConfig?.scansPerDay ?? 50;

  if (plan === 'pro' || plan === 'team') {
    const used = parseInt(await redis.get(key) ?? '0', 10);
    return { allowed: true, used, limit: -1, remaining: -1 };
  }

  const used = parseInt(await redis.get(key) ?? '0', 10);
  return {
    allowed: used < limit,
    used,
    limit,
    remaining: Math.max(limit - used, 0),
  };
}
