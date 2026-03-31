import { z } from 'zod';

export const UserAddBalanceSchema = z.object({
  addedBalanceInCents: z.number().int().min(1),
});
