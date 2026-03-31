import type { Request, Response, NextFunction } from 'express';
import { type ZodType, ZodError } from 'zod';
import type { ErrorRequestHandler } from 'express';

export const validate =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.parseAsync({
        ...req.body,
        ...req.query,
        ...req.params,
      });

      req.validated = result;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.flatten(),
        });
      }
      next(error);
    }
  };

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next,
) => {
  console.error(' [ERROR] ', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : 'REDACTED',
  });

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
