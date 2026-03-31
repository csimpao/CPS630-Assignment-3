import { ZodObject } from 'zod';

declare global {
  namespace Express {
    interface Request {
      validated: unknown;
    }
  }
}

export {};
