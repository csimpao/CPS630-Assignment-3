import type { Auction } from '@auction-platform/shared/domain';
import { getAuctionRoom } from '../getAuctionRoom';

describe('getAuctionRoom', () => {
  it('should return the correct room for the given auctionId', () => {
    const auctionId: Auction['auctionId'] = 1234;
    const room = getAuctionRoom(auctionId);

    expect(room).toEqual('auction:1234');
  });
});
