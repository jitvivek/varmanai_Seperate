import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './clerkAuth.js';
import { checkAndIncrementUsage } from '../services/usageService.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function usageLimit(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'User not authenticated' } });
      return;
    }

    // Get user's plan
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      // Auto-create user on first request
      const email = `${userId}@clerk.user`;
      user = await prisma.user.create({ data: { id: userId, email } });
    }

    const result = await checkAndIncrementUsage(userId, user.plan);

    if (!result.allowed) {
      res.status(429).json({
        error: {
          code: 'USAGE_LIMIT_EXCEEDED',
          message: 'Daily free limit reached. Upgrade to Pro for unlimited scans.',
        },
        upgrade_url: 'https://varmanai.com/dashboard/billing',
        usage: { used: result.used, limit: result.limit, remaining: result.remaining },
      });
      return;
    }

    // Attach usage info for response
    (req as AuthenticatedRequest & { usageInfo?: typeof result }).usageInfo = result;
    next();
  } catch (err: unknown) {
    next(err);
  }
}
