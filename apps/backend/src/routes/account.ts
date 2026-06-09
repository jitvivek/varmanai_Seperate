import { Router } from 'express';
import { clerkAuth, type AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

router.get('/v1/account', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    res.json({
      userId: user.id,
      email: user.email,
      plan: user.plan,
      planExpiresAt: user.planExpiresAt,
      createdAt: user.createdAt,
    });
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
