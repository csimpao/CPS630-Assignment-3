import type {
  AuctionJoinParams,
  AuctionJoinResponse,
  ClientToServerEvents,
} from '@auction-platform/shared/domain';
import type { Socket, DefaultEventsMap } from 'socket.io';
import type { AuctionService } from '../../types/services';
import { getAuctionRoom } from '../../lib/getAuctionRoom';
import { AuctionGetSchema } from '@auction-platform/shared/schemas';
import { z } from 'zod';

export function joinAuction(
  socket: Socket<
    ClientToServerEvents,
    ClientToServerEvents,
    DefaultEventsMap,
    any
  >,
  auctionService: AuctionService,
) {
  return async (
    params: AuctionJoinParams,
    cb: (response: AuctionJoinResponse) => void,
  ) => {
    try {
      const validated = await AuctionGetSchema.parseAsync({
        auctionId: params.auctionId,
      });
      const auctionId = validated.auctionId;

      const auction = await auctionService.getAuction(auctionId);

      // socket should only be in one room
      // we assume that one request exists at a time per socket
      // accepting missed messages if this is violated
      const roomsToLeave = Array.from(socket.rooms).filter(
        (room) => room !== socket.id,
      );
      for (const room of roomsToLeave) {
        await socket.leave(room);
      }

      await socket.join(getAuctionRoom(auctionId));

      const response: AuctionJoinResponse = {
        status: 'ok',
        payload: auction,
        error: null,
      };
      cb(response);
    } catch (err) {
      let errorMessage = 'Could not join auction';

      if (err instanceof z.ZodError) {
        errorMessage =
          'Invalid input: ' +
          err.issues.map((e) => e.path.join('.')).join(', ');
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error(`joinAuction Error: ${params.auctionId}`, err);

      cb({
        status: 'error',
        payload: null,
        error: errorMessage,
      });
    }
  };
}
