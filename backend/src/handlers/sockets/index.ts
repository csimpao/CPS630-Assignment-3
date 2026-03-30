import type { DefaultEventsMap, Server } from 'socket.io';
import type {
  UserService,
  AuctionService,
  QueueService,
} from '../../types/services';
import type { ClientToServerEvents } from '@auction-platform/shared/socket';
import type {
  AuctionJoinParams,
  AuctionJoinResponse,
} from '@auction-platform/shared';
import { joinAuction } from './joinAuction';

export function socketApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
  io: Server<ClientToServerEvents, ClientToServerEvents, DefaultEventsMap, any>,
) {
  io.on('connection', (socket) => {
    socket.on('joinAuction', joinAuction(socket, auctionService));
  });
}
