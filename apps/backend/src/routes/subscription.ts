import { Router } from 'express';
import { z } from 'zod';
import { clerkAuth, type AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { createOrder, verifyPayment } from '../services/subscriptionService.js';
import { handleWebhook } from '../services/webhookService.js';

const router: Router = Router();

const createOrderSchema = z.object({
  planId: z.enum(['pro', 'team']),
  billing: z.enum(['monthly', 'annual']),
  seats: z.number().int().min(1).optional(),
});

const verifySchema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
});

router.post('/v1/subscription/create-order', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
      });
      return;
    }

    const { planId, billing, seats } = parsed.data;
    const userId = req.userId as string;

    const result = await createOrder(userId, planId, billing, seats);
    res.json(result);
  } catch (err: unknown) {
    next(err);
  }
});

router.post('/v1/subscription/verify', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parsed.error.issues },
      });
      return;
    }

    const { orderId, paymentId, signature } = parsed.data;
    const userId = req.userId as string;

    const result = await verifyPayment(orderId, paymentId, signature, userId);
    res.json(result);
  } catch (err: unknown) {
    next(err);
  }
});

router.post('/v1/subscription/webhook', async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (typeof signature !== 'string') {
      res.status(400).json({ error: { code: 'INVALID_SIGNATURE', message: 'Missing webhook signature' } });
      return;
    }

    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    await handleWebhook(body, signature);
    res.json({ status: 'ok' });
  } catch (err: unknown) {
    next(err);
  }
});

export default router;
