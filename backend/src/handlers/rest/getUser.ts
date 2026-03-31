import type { NextFunction, Request, Response } from 'express';
import type { UserService } from '../../types/services';

export function getUser(userService: UserService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUser(0); // TODO: fetch this off the JWT

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
}
