import { Router } from 'express';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { clerkAuth, type AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

function generateApiKey(): string {
  const bytes = randomBytes(24);
  return `sk_shield_${bytes.toString('base64url')}`;
}

const createKeySchema = z.object({
  name: z.string().min(1).max(64).default('Default'),
});

// Generate a new API key (user must be authenticated via Clerk/website)
router.post('/v1/api-keys', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const parsed = createKeySchema.safeParse(req.body);
    const name = parsed.success ? parsed.data.name : 'Default';

    const key = generateApiKey();

    const apiKey = await prisma.apiKey.create({
      data: { userId, key, name },
    });

    // Return the full key only on creation — never again
    res.json({
      id: apiKey.id,
      key: apiKey.key,
      name: apiKey.name,
      createdAt: apiKey.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// List user's API keys (masked)
router.get('/v1/api-keys', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;

    const keys = await prisma.apiKey.findMany({
      where: { userId, revokedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      keys: keys.map((k) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.key.slice(0, 14) + '...',
        lastUsedAt: k.lastUsedAt,
        createdAt: k.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
});

// Revoke an API key
router.delete('/v1/api-keys/:id', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;
    const keyId = req.params.id;
    if (typeof keyId !== 'string') {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid key id' } });
      return;
    }

    const key = await prisma.apiKey.findFirst({
      where: { id: keyId, userId },
    });

    if (!key) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'API key not found' } });
      return;
    }

    await prisma.apiKey.update({
      where: { id: keyId },
      data: { revokedAt: new Date() },
    });

    res.json({ revoked: true });
  } catch (err) {
    next(err);
  }
});

export default router;
