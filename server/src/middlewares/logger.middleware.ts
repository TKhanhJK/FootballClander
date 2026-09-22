import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const requestId = crypto.randomUUID().slice(0, 8);
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  // Hook into response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const timestamp = new Date().toISOString();

    const logEntry = {
      timestamp,
      requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'unknown'
    };

    // Color code status for terminal visibility
    const isError = statusCode >= 400;
    const isServerErr = statusCode >= 500;
    const icon = isServerErr ? '🔥' : isError ? '⚠️' : '✅';

    console.log(
      `[${timestamp}] ${icon} [${requestId}] ${req.method} ${req.originalUrl} -> ${statusCode} (${duration}ms)`
    );

    if (isError && statusCode !== 404) {
      // Print structured JSON for observability
      console.log('   ↳ Log Detail:', JSON.stringify(logEntry));
    }
  });

  next();
}

