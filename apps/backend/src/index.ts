import { app } from './app.js';
import { env } from './config/env.js';
import { redis } from './config/redis.js';
import { logger } from './config/logger.js';

async function main(): Promise<void> {
  try {
    await redis.connect();
    logger.info('Redis connected successfully');

    app.listen(env.PORT, () => {
      logger.info({ port: env.PORT, env: env.NODE_ENV }, 'VarmanAI backend running');
    });
  } catch (err: unknown) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
}

main();

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled rejection');
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});
