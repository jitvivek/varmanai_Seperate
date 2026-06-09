import { Router } from 'express';
import { redis } from '../config/redis.js';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

router.get('/v1/health', async (_req, res) => {
  let redisOk = false;
  let dbOk = false;

  try {
    const pong = await redis.ping();
    redisOk = pong === 'PONG';
  } catch {
    redisOk = false;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const status = redisOk && dbOk ? 'ok' : 'degraded';
  const httpStatus = status === 'ok' ? 200 : 503;

  res.status(httpStatus).json({ status, redis: redisOk, db: dbOk });
});

export default router;
