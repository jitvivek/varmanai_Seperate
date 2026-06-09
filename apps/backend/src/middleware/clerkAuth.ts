import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@clerk/backend';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function clerkAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Dev-mode bypass: skip real auth when using placeholder key
    if (env.NODE_ENV === 'development' && env.CLERK_SECRET_KEY.includes('dev_placeholder')) {
      req.userId = 'dev_user_local';
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid authorization header' } });
      return;
    }

    const token = authHeader.slice(7);
    const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    });

    if (!payload.sub) {
      res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token: no subject' } });
      return;
    }

    req.userId = payload.sub;
    next();
  } catch (err: unknown) {
    logger.warn({ err }, 'Auth verification failed');
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Token verification failed' } });
  }
}
