import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const prisma = new PrismaClient();

export async function handleWebhook(
  body: string,
  signature: string
): Promise<void> {
  try {
    const crypto = await import('node:crypto');
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature');
    }

    const payload = JSON.parse(body) as {
      event: string;
      payload: {
        payment?: { entity: { order_id: string; status: string } };
        subscription?: { entity: { id: string; status: string } };
      };
    };

    switch (payload.event) {
      case 'payment.captured': {
        const orderId = payload.payload.payment?.entity.order_id;
        if (orderId) {
          await prisma.subscription.updateMany({
            where: { razorpayOrderId: orderId, status: 'created' },
            data: { status: 'active', startedAt: new Date() },
          });
        }
        break;
      }
      case 'payment.failed': {
        const orderId = payload.payload.payment?.entity.order_id;
        if (orderId) {
          await prisma.subscription.updateMany({
            where: { razorpayOrderId: orderId },
            data: { status: 'cancelled' },
          });
        }
        break;
      }
      default:
        logger.info({ event: payload.event }, 'Unhandled webhook event');
    }
  } catch (err: unknown) {
    logger.error({ err }, 'Webhook processing failed');
    throw err;
  }
}
