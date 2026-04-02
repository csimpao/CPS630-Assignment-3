import type { NextFunction, Request, Response } from 'express';
import type { UserService } from '../../types/services';
import type { HandledError } from './middleware';

export function getUser(userService: UserService) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getUser(0); // TODO: fetch this off the JWT
      if (!user) {
        const err: HandledError = {
          message: 'User could not be found',
          statusCode: 404,
        };
        throw err;
      }

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
}
