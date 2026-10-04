import express from 'express';
import path from 'path';
import cors from 'cors';
import healthRoutes from './routes/health.routes';
import meetingRoutes from './routes/meeting.routes';
import logger from './config/logger';

const app = express();

app.use(cors());
app.use(express.json());

// Observability Middleware
app.use((req, res, next) => {
  const start = Date.now();
  let logged = false;

  const logRequest = (status: string | number) => {
    if (logged) return;

    logged = true;

    const duration = Date.now() - start;

    logger.info(
      `[API] ${req.method} ${req.originalUrl} -> ${status} (${duration}ms)`
    );
  };

  // Normal completed response
  res.on('finish', () => {
    logRequest(res.statusCode);
  });

  // Client disconnected before response completed
  res.on('close', () => {
    if (!res.writableFinished) {
      logRequest('ABORTED');
    }
  });

  // Request was explicitly aborted by the client
  req.on('aborted', () => {
    logRequest('ABORTED');
  });

  next();
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/meetings', meetingRoutes);

// Fallback error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    logger.error(err.stack);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
);

// Serve frontend in production
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// SPA Fallback for all non-API routes
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Unknown route handler for API requests
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
  });
});

export default app;