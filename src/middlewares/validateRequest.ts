import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body directly
      const validatedData = await schema.parseAsync(req.body);
      
      // Update the request body with the validated data
      req.body = validatedData;
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 400,
            type: 'ValidationError',
            message: 'Validation error',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          }
        });
      }
      
      next(error);
    }
  };
}; 