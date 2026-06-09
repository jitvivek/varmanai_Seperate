import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './clerkAuth.js';
import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

const prisma = new PrismaClient();

/**
 * Middleware that accepts EITHER a Clerk JWT OR a VarmanAI API key.
 * - Clerk JWT: `Authorization: Bearer eyJ...` (starts with ey)
 * - API key: `Authorization: Bearer sk_shield_...`
 *
 * This allows the extension to authenticate with API keys while
 * the website/dashboard continues using Clerk tokens.
 */
export async function apiKeyAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing authorization header' } });
    return;
  }

  const token = authHeader.slice(7);

  // If it's an API key (starts with sk_shield_), validate against DB
  if (token.startsWith('sk_shield_')) {
    try {
      const apiKey = await prisma.apiKey.findUnique({
        where: { key: token },
        include: { user: { select: { id: true, plan: true } } },
      });

      if (!apiKey || apiKey.revokedAt) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or revoked API key' } });
        return;
      }

      // Update last used timestamp (non-blocking)
      prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      }).catch(() => {});

      req.userId = apiKey.userId;
      next();
    } catch (err) {
      logger.warn({ err }, 'API key lookup failed');
      res.status(500).json({ error: { code: 'INTERNAL', message: 'Auth lookup failed' } });
    }
    return;
  }

  // Otherwise, fall through to Clerk verification (handled by next middleware in chain)
  // Import clerkAuth dynamically to avoid circular dependency
  const { clerkAuth } = await import('./clerkAuth.js');
  clerkAuth(req, res, next);
}
