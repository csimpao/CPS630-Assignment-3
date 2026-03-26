import type { Request, Response } from 'express';
import type { UserService } from '../../types/services';

export function getUser(userService: UserService) {
  return async (req: Request, res: Response) => {
    const user = await userService.getUser(0);

    return res.status(200).json(user);
  };
}
