import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { apiKeyAuth } from '../middleware/apiKeyAuth.js';
import { clerkAuth, type AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

function generateApiKey(): string {
  return `sk_shield_${randomBytes(24).toString('base64url')}`;
}

const registerSchema = z.object({
  browser: z.enum(['chrome', 'edge', 'safari', 'firefox']).default('chrome'),
  version: z.string().default('1.0.0'),
  extensionId: z.string().optional(),
});

// One-click connect: called by the website (with a Clerk session token) right
// after the user signs in. Returns a long-lived API key that the website hands
// off to the installed extension. Re-uses the user's existing extension key so
// repeated connects don't pile up keys.
router.post('/v1/extension/connect', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;

    // Auto-create the user on first connect (mirrors usageLimit behaviour).
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId, email: `${userId}@clerk.user` },
      });
    }

    let apiKey = await prisma.apiKey.findFirst({
      where: { userId, name: 'Extension', revokedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!apiKey) {
      apiKey = await prisma.apiKey.create({
        data: { userId, key: generateApiKey(), name: 'Extension' },
      });
    }

    res.json({ apiKey: apiKey.key, plan: user.plan });
  } catch (err) {
    next(err);
  }
});

// Called by the extension when user activates it with their API key
router.post('/v1/extension/register', apiKeyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } });
      return;
    }

    const { browser, version, extensionId } = parsed.data;

    const install = await prisma.extensionInstall.upsert({
      where: { userId_browser: { userId, browser } },
      create: { userId, browser, version, extensionId },
      update: { version, extensionId, lastActiveAt: new Date() },
    });

    res.json({ registered: true, installId: install.id });
  } catch (err) {
    next(err);
  }
});

// Heartbeat — extension pings periodically to show it's still active
router.post('/v1/extension/heartbeat', apiKeyAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const { browser = 'chrome' } = req.body;

    await prisma.extensionInstall.updateMany({
      where: { userId, browser },
      data: { lastActiveAt: new Date() },
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
