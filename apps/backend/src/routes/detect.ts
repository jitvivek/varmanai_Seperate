import { Router } from 'express';
import { z } from 'zod';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import type { AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { usageLimit } from '../middleware/usageLimit.js';
import { detectRateLimiter } from '../middleware/rateLimit.js';
import { runDetection } from '../services/detectionService.js';
import type { UsageResult } from '@varmanai/core';

const router: Router = Router();

const detectSchema = z.object({
  text: z.string().min(1, 'Text is required').max(10000, 'Text must be 10000 characters or less'),
  site: z.string().optional(),
});

router.post(
  '/v1/detect',
  detectRateLimiter,
  apiKeyAuth,
  usageLimit,
  async (req: AuthenticatedRequest & { usageInfo?: UsageResult }, res, next) => {
    try {
      const parsed = detectSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: parsed.error.issues,
          },
        });
        return;
      }

      const { text, site } = parsed.data;
      const userId = req.userId as string;

      const result = await runDetection(text, userId, site);

      const usage = req.usageInfo ?? { used: -1, limit: -1, remaining: -1 };

      res.json({
        ...result,
        usage: {
          used: usage.used,
          limit: usage.limit,
          remaining: usage.remaining,
        },
      });
    } catch (err: unknown) {
      next(err);
    }
  }
);

export default router;
