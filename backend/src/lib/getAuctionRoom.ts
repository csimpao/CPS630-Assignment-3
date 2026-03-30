import type { Auction } from '@auction-platform/shared';

export function getAuctionRoom(auctionId: Auction['auctionId']) {
  return `auction:${auctionId}`;
}
