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

export function restApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
) {
  const router = Router();

  router.post('/auctions', createAuction(auctionService, queueService));
  router.patch('/me/balance', addBalance(userService));
  router.get('/me', getUser(userService));
  router.get('/auctions', searchAuctions(auctionService));

  return router;
}
