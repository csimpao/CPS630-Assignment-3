import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { UserService } from '../../types/services';
import type { UserCreateSchema, UserLoginSchema } from '@auction-platform/shared/schemas';
import { z } from 'zod';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const JWT_EXPIRES_IN = '7d';

function signToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

type SignupData = z.infer<typeof UserCreateSchema>;
type LoginData = z.infer<typeof UserLoginSchema>;

export function signup(userService: UserService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const params = req.validated as SignupData;
    try {
      const user = await userService.createUser(params);
      const token = signToken(user.userId);
      return res.status(201).json({ token, user });
    } catch (err) {
      if (err instanceof Error && err.message === 'Email already in use') {
        return res.status(409).json({ status: 'error', message: err.message });
      }
      next(err);
    }
  };
}

export function login(userService: UserService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const params = req.validated as LoginData;
    try {
      const result = await userService.getUserByEmail(params.email);
      if (!result) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(params.password, result.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
      }

      const token = signToken(result.user.userId);
      return res.status(200).json({ token, user: result.user });
    } catch (err) {
      next(err);
    }
  };
}
