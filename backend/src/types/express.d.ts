declare global {
  namespace Express {
    interface Request {
      validated: unknown;
      userId: number;
    }
  }
}

export {};
