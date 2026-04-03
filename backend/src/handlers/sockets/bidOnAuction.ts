import type {
  BidCreationParams,
  BidCreationResponse,
} from '@auction-platform/shared/domain';
import type { AuctionService, SocketService } from '../../types/services';
import { BidCreationSchema } from '@auction-platform/shared/schemas';
import { z } from 'zod';

export function bidOnAuction(
  auctionService: AuctionService,
  socketService: SocketService,
) {
  return async (
    auctionId: number,
    bidInCents: number,
    cb: (response: BidCreationResponse) => void,
  ) => {
    try {
      const validated = await BidCreationSchema.parseAsync({
        auctionId,
        bidInCents,
      });

      const params: BidCreationParams = {
        auctionId: validated.auctionId,
        bidInCents: validated.bidInCents,
        userId: 1, // authentication to be added later
      };

      const bid = await auctionService.placeBid(params);
      if (!bid) {
        throw new Error(
          'Bid failed to be placed on auction, auctionService error',
        );
      }

      cb({
        status: 'ok',
        payload: bid,
        error: null,
      });

      await socketService.notifyBid(params.auctionId, bid);
    } catch (err) {
      let errorMessage = 'Could not place bid';

      if (err instanceof z.ZodError) {
        errorMessage =
          'Invalid input: ' +
          err.issues.map((e) => e.path.join('.')).join(', ');
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error(`bidOnAuction Error: ${errorMessage}`, err);

      cb({
        status: 'error',
        payload: null,
        error: errorMessage,
      });
    }
  };
}
