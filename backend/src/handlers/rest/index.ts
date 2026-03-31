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
import { validate } from './middleware';
import {
  AuctionCreateSchema,
  AuctionSearchSchema,
  UserAddBalanceSchema,
} from '@auction-platform/shared/schemas';

export function restApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
) {
  const router = Router();

  router.post(
    '/auctions',
    validate(AuctionCreateSchema),
    createAuction(auctionService, queueService),
  );
  router.patch(
    '/me/balance',
    validate(UserAddBalanceSchema),
    addBalance(userService),
  );
  router.get('/me', getUser(userService));
  router.get(
    '/auctions',
    validate(AuctionSearchSchema),
    searchAuctions(auctionService),
  );

  return router;
}
