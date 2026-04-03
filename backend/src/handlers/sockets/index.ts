import type { DefaultEventsMap, Server } from 'socket.io';
import type {
  UserService,
  AuctionService,
  QueueService,
  SocketService,
} from '../../types/services';
import type { ClientToServerEvents } from '@auction-platform/shared/domain';
import { joinAuction } from './joinAuction';
import { leaveAuction } from './leaveAuction';
import { bidOnAuction } from './bidOnAuction';

export function socketApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
  socketService: SocketService,
  io: Server<ClientToServerEvents, ClientToServerEvents, DefaultEventsMap, any>,
) {
  io.on('connection', (socket) => {
    socket.on('joinAuction', joinAuction(socket, auctionService));
    socket.on('leaveAuction', leaveAuction(socket));
    socket.on('bidOnAction', bidOnAuction(auctionService, socketService));
  });
}
