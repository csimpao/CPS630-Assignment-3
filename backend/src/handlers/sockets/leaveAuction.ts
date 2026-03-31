import type {
  AuctionLeaveResponse,
  ClientToServerEvents,
} from '@auction-platform/shared/domain';
import type { Socket, DefaultEventsMap } from 'socket.io';

export function leaveAuction(
  socket: Socket<
    ClientToServerEvents,
    ClientToServerEvents,
    DefaultEventsMap,
    any
  >,
) {
  return async (cb: (response: AuctionLeaveResponse) => void) => {
    try {
      // we assume that one request exists at a time per socket
      // accepting missed messages if this is violated
      const roomsToLeave = Array.from(socket.rooms).filter(
        (room) => room !== socket.id,
      );
      for (const room of roomsToLeave) {
        await socket.leave(room);
      }
      const response: AuctionLeaveResponse = {
        status: 'ok',
        payload: null,
        error: null,
      };
      cb(response);
    } catch (err) {
      console.log(`leaveAuction: Failed to leave auction rooms: ${err}`);
      const response: AuctionLeaveResponse = {
        status: 'error',
        payload: null,
        error: 'Failed to leave room',
      };
      cb(response);
    }
  };
}
