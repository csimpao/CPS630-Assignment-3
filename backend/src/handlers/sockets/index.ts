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
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export function socketApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
  socketService: SocketService,
  io: Server<ClientToServerEvents, ClientToServerEvents, DefaultEventsMap, any>,
) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
      socket.data.userId = payload.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinAuction', joinAuction(socket, auctionService));
    socket.on('leaveAuction', leaveAuction(socket));
    socket.on('bidOnAction', bidOnAuction(auctionService, socketService, socket.data.userId));
  });
}
