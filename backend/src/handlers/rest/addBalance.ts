import type { Request, Response } from 'express';
import type { UserService } from '../../types/services';
import { UserAddBalanceSchema } from '@auction-platform/shared/schemas';
import { z } from 'zod';

type ValidatedData = z.infer<typeof UserAddBalanceSchema>;

export function addBalance(userService: UserService) {
  return async (req: Request, res: Response) => {
    const params = {
      ...(req.validated as ValidatedData),
      userId: 0, // TODO: add this from authentication
    };
    const user = await userService.addToUserBalance(params);

    return res.status(200).json(user);
  };
}
