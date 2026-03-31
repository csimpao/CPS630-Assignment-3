import type { Auction } from '@auction-platform/shared/domain';

export function getAuctionRoom(auctionId: Auction['auctionId']) {
  return `auction:${auctionId}`;
}
