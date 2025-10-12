import { ErrorRequestHandler } from 'express';
import { logger } from '../lib/logger';
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err as any;
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  logger.error(message, { statusCode, stack: error.stack, requestId: req.id });
  const payload: any = { status: statusCode >= 500 ? 'error' : 'fail', message };
  if (process.env.NODE_ENV !== 'production') payload.stack = error.stack;
  if (error.details) payload.details = error.details;
  res.status(statusCode).json(payload);
};
export { AppError, errorHandler };
export default errorHandler;
