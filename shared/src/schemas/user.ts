import { z } from 'zod';

export const UserAddBalanceSchema = z.object({
  addedBalanceInCents: z.number().int().min(1),
});

export const UserCreateSchema = z.object({
  name: z.string().min(1).max(128),
  email: z.string().email(),
  password: z.string().min(6),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
