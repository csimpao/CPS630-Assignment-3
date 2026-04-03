import { Router } from 'express';
import type {
  AuctionService,
  QueueService,
  UserService,
} from '../../types/services';
import { createAuction } from './createAuction';
import { addBalance } from './addBalance';
import { getUser } from './getUser';
import { searchAuctions } from './searchAuctions';
import { signup, login } from './auth';
import { validate, requireAuth } from './middleware';
import {
  AuctionCreateSchema,
  AuctionSearchSchema,
  UserAddBalanceSchema,
  UserCreateSchema,
  UserLoginSchema,
} from '@auction-platform/shared/schemas';

export function restApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
) {
  const router = Router();

  router.post('/auth/signup', validate(UserCreateSchema), signup(userService));
  router.post('/auth/login', validate(UserLoginSchema), login(userService));

  router.get('/me', requireAuth, getUser(userService));
  router.patch(
    '/me/balance',
    requireAuth,
    validate(UserAddBalanceSchema),
    addBalance(userService),
  );

  router.post(
    '/auctions',
    requireAuth,
    validate(AuctionCreateSchema),
    createAuction(auctionService, queueService),
  );
  router.get(
    '/auctions',
    validate(AuctionSearchSchema),
    searchAuctions(auctionService),
  );

  return router;
}
