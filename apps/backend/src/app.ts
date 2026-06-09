import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestId } from './middleware/requestId.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { errorHandler } from './middleware/errorHandler.js';
import detectRouter from './routes/detect.js';
import usageRouter from './routes/usage.js';
import subscriptionRouter from './routes/subscription.js';
import accountRouter from './routes/account.js';
import healthRouter from './routes/health.js';
import extensionRouter from './routes/extension.js';
import statsRouter from './routes/stats.js';
import apiKeysRouter from './routes/apiKeys.js';

const app: Express = express();

// Security
app.use(helmet());
app.use(cors({
  origin: [
    env.FRONTEND_URL,
    /^chrome-extension:\/\//,
  ],
  credentials: true,
}));

// Body parsing
app.use('/v1/subscription/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '1mb' }));

// Middleware
app.use(requestId);
app.use(rateLimiter);

// Routes
app.use(detectRouter);
app.use(usageRouter);
app.use(subscriptionRouter);
app.use(accountRouter);
app.use(healthRouter);
app.use(extensionRouter);
app.use(statsRouter);
app.use(apiKeysRouter);

// Error handler (must be last)
app.use(errorHandler);

export { app };
