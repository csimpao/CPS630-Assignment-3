import type {
  BidCreationParams,
  BidCreationResponse,
} from '@auction-platform/shared/domain';
import type { AuctionService, SocketService } from '../../types/services';

export function bidOnAuction(
  auctionService: AuctionService,
  socketService: SocketService,
) {
  return async (
    auctionId: number,
    bidInCents: number,
    cb: (response: BidCreationResponse) => void,
  ) => {
    const params: BidCreationParams = {
      auctionId,
      bidInCents,
      userId: 0, // TODO: add this with authentication
    };

    try {
      const bid = await auctionService.placeBid(params);

      const response: BidCreationResponse = {
        status: 'ok',
        payload: bid,
        error: null,
      };
      cb(response);
      await socketService.notifyBid(params.auctionId, bid);
    } catch (err) {
      // TODO: handle differently based upon error thrown
      console.log(
        `bidOnAuction: Could not place bid for params ${params}, ${err}`,
      );

      const response: BidCreationResponse = {
        status: 'error',
        payload: null,
        error: 'Could not place bid',
      };
      cb(response);
    }
  };
}
