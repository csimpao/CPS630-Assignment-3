import type { Request, Response } from 'express';
import type { UserService } from '../../types/services';

export function addBalance(userService: UserService) {
  return async (req: Request, res: Response) => {
    const user = await userService.addToUserBalance({} as any);

    return res.status(200).json(user);
  };
}
