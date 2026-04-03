import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/domain';
import type { Express } from 'express';
import { Server as SocketIoServer } from 'socket.io';
import type {
  AuctionService,
  QueueService,
  SocketService,
  UserService,
} from './types/services';
import express from 'express';
import { restApi } from './handlers/rest';
import { globalErrorHandler } from './handlers/rest/middleware';
import { socketApi } from './handlers/sockets';

export function createApp(
  app: Express,
  io: SocketIoServer<ClientToServerEvents, ServerToClientEvents>,
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
  socketService: SocketService,
) {
  app.use(express.json());
  app.use('/', restApi(userService, auctionService, queueService));
  app.use(globalErrorHandler);
  socketApi(userService, auctionService, queueService, socketService, io);
}
