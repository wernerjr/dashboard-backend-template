import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

interface ErrorResponse {
  success: false;
  error: {
    code: number;
    type: string;
    message: string;
    details?: unknown;
  };
}

// Wrapper for async route handlers
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: 500,
      type: 'InternalServerError',
      message: 'Internal server error'
    }
  };

  // Handle known error types
  if (error instanceof AppError) {
    errorResponse.error = {
      code: error.statusCode,
      type: error.name,
      message: error.message
    };
  } else if (error instanceof ZodError) {
    errorResponse.error = {
      code: 400,
      type: 'ValidationError',
      message: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    };
  } else if (error instanceof Error) {
    errorResponse.error = {
      code: 500,
      type: error.name || 'UnknownError',
      message: error.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };
  }

  // Ensure headers haven't been sent yet
  if (!res.headersSent) {
    return res.status(errorResponse.error.code).json(errorResponse);
  }

  next(error);
} 