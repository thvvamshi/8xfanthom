import app from './app';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import logger from './config/logger';

const startServer = async (): Promise<void> => {
  try {
    logger.info('Loading environment...');
    logger.info(`Environment: ${config.nodeEnv}`);

    await connectDatabase().catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      logger.warn(`Starting in degraded mode: ${message}`);
    });

    const server = app.listen(config.port, () => {
      logger.info(`Server running at http://localhost:${config.port}`);
      logger.info(`Health: http://localhost:${config.port}/api/health`);
    });

    const shutdown = (signal: string): void => {
      logger.info(`Received ${signal}, shutting down...`);
      server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    logger.error(`Failed to start server: ${message}`);
    if (stack) logger.error(stack);
    process.exit(1);
  }
};

process.on('unhandledRejection', (reason: unknown) => {
  logger.error(`Unhandled Rejection: ${String(reason)}`);
});

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.stack || err.message}`);
});

startServer();