import { Router } from 'express';
import { clerkAuth, type AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { getCurrentUsage } from '../services/usageService.js';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

router.get('/v1/usage', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    const usage = await getCurrentUsage(userId, user.plan);

    // Calculate reset time (midnight IST = 18:30 UTC previous day)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(18, 30, 0, 0); // Midnight IST = 18:30 UTC
    if (tomorrow.getTime() - now.getTime() > 24 * 60 * 60 * 1000) {
      tomorrow.setUTCDate(tomorrow.getUTCDate() - 1);
    }

    res.json({
      plan: user.plan,
      used: usage.used,
      limit: usage.limit,
      remaining: usage.remaining,
      resetsAt: tomorrow.toISOString(),
    });
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
