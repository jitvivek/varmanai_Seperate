import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  CLERK_SECRET_KEY: z.string().default('sk_test_dev_placeholder'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_dev_placeholder'),
  RAZORPAY_KEY_SECRET: z.string().default('dev_placeholder'),
  RAZORPAY_WEBHOOK_SECRET: z.string().default('dev_placeholder'),
  PORT: z.string().default('4000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Environment validation failed:');
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
