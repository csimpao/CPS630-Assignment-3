import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/domain';
import { Server as SocketIoServer, type DefaultEventsMap } from 'socket.io';
import { SocketIoSocketService } from '../services/socket.service';
import { FakeAuctionService } from './auctionService.mock';
import express from 'express';
import { Server, createServer, IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../createApp';
import { mockQueueService } from './queueService.mock';
import type {
  AuctionService,
  QueueService,
  SocketService,
  UserService,
} from '../types/services';

export type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
export type IoServer = SocketIoServer<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  any
>;

export function getMockApp(params?: {
  userService?: UserService;
  auctionService?: AuctionService;
  queueService?: QueueService;
  socketService?: SocketService;
}) {
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketIoServer<ClientToServerEvents, ServerToClientEvents>(
    httpServer,
    {
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
      },
    },
  );
  const userService = params?.userService ?? (null as any); // TODO: Fix this
  const auctionService = params?.auctionService ?? new FakeAuctionService();
  const queueService = params?.queueService ?? mockQueueService;
  const socketService =
    params?.socketService ?? new SocketIoSocketService(io, auctionService);

  createApp(app, io, userService, auctionService, queueService, socketService);
  return { app, httpServer, io };
}
