import Razorpay from 'razorpay';
import { PrismaClient } from '@prisma/client';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  pro: {
    monthly: 19900,
    annual: 190800,
  },
  team: {
    monthly: 14900,
    annual: 178800, // 14900 * 12 * 0.8
  },
};

export async function createOrder(
  userId: string,
  planId: 'pro' | 'team',
  billing: 'monthly' | 'annual',
  seats?: number
): Promise<{ orderId: string; amount: number; currency: string; razorpayKeyId: string }> {
  try {
    const planPricing = PLANS[planId];
    let amount = planPricing[billing];

    if (planId === 'team' && seats && seats > 1) {
      amount = amount * seats;
    }

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      notes: { userId, planId, billing, seats: String(seats ?? 1) },
    });

    await prisma.subscription.create({
      data: {
        userId,
        plan: planId,
        billing,
        razorpayOrderId: order.id,
        status: 'created',
        amount,
      },
    });

    return {
      orderId: order.id,
      amount,
      currency: 'INR',
      razorpayKeyId: env.RAZORPAY_KEY_ID,
    };
  } catch (err: unknown) {
    logger.error({ err }, 'Failed to create Razorpay order');
    throw err;
  }
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string,
  userId: string
): Promise<{ success: boolean; plan: string; expiresAt: Date }> {
  try {
    const crypto = await import('node:crypto');
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid payment signature');
    }

    const subscription = await prisma.subscription.findUnique({
      where: { razorpayOrderId: orderId },
    });

    if (!subscription || subscription.userId !== userId) {
      throw new Error('Order not found or does not belong to user');
    }

    const now = new Date();
    const expiresAt = new Date(now);
    if (subscription.billing === 'annual') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    await prisma.subscription.update({
      where: { razorpayOrderId: orderId },
      data: {
        razorpayPaymentId: paymentId,
        status: 'active',
        startedAt: now,
        expiresAt,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: subscription.plan,
        planExpiresAt: expiresAt,
      },
    });

    return { success: true, plan: subscription.plan, expiresAt };
  } catch (err: unknown) {
    logger.error({ err }, 'Payment verification failed');
    throw err;
  }
}
