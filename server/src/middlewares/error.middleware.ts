import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/index.js';
import { config } from '../config/env.js';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] || 'system';

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.details || undefined,
      requestId
    });
    return;
  }

  // Handle JSON parsing error
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({
      success: false,
      statusCode: 400,
      message: 'Định dạng JSON gửi lên không hợp lệ.',
      requestId
    });
    return;
  }

  // Unhandled internal server error
  console.error(`[${new Date().toISOString()}] 💥 Unhandled Internal Error [${requestId}]:`, err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Lỗi máy chủ nội bộ. Vui lòng liên hệ quản trị viên.',
    requestId,
    ...(config.isProduction ? {} : { stack: err.stack })
  });
}

