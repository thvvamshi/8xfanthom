import mongoose from 'mongoose';
import { config } from './env';
import logger from './logger';

export const connectDatabase = async (): Promise<void> => {
  if (!config.databaseUrl) {
    logger.warn('No DATABASE_URL — skipping MongoDB connection');
    return;
  }

  try {
    logger.info('Connecting to MongoDB...');
    await mongoose.connect(config.databaseUrl, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('Connected to MongoDB');
  } catch (error: any) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};