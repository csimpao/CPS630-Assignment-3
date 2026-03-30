import type {
  AuctionJoinParams,
  AuctionJoinResponse,
} from '@auction-platform/shared';
import type { ClientToServerEvents } from '@auction-platform/shared/socket';
import type { Socket, DefaultEventsMap } from 'socket.io';
import type { AuctionService } from '../../types/services';
import { getAuctionRoom } from '../../lib/getAuctionRoom';

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
    const auctionId = params.auctionId;

    try {
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
      console.log(
        `joinAuction: Failed to switch to auction with id ${auctionId}: ${err}`,
      );
      const response: AuctionJoinResponse = {
        status: 'error',
        payload: null,
        error: 'Failed to switch rooms',
      };
      cb(response);
    }
  };
}
