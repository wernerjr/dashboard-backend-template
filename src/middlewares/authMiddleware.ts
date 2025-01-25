import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

interface JWTPayload {
  id: string;
  role: 'USER' | 'ADMIN';
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, 'No token provided');
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Invalid token format');
    }

    // Get the token part
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'No token provided');
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
      
      // Add user info to request
      req.user = decoded;
      
      next();
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }
  } catch (error) {
    next(error);
  }
}; 