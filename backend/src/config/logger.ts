import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const prefix = `${timestamp} [${level}] [8xFathom]`;
      if (stack) return `${prefix} ${message}\n${stack}`;
      return `${prefix} ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
  exitOnError: false,
});

if (typeof (logger as any)?.info !== 'function') {
  console.error('❌ Logger failed to initialize:', logger);
  process.exit(1);
}

export default logger;