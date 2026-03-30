import type {
  BidCreationParams,
  BidCreationResponse,
} from '@auction-platform/shared';
import type { AuctionService, SocketService } from '../../types/services';

export function bidOnAuction(
  auctionService: AuctionService,
  socketService: SocketService,
) {
  return async (
    params: BidCreationParams,
    cb: (response: BidCreationResponse) => void,
  ) => {
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
