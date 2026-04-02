import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/domain';
import { Server as SocketIoServer, type DefaultEventsMap } from 'socket.io';
import { SocketIoSocketService } from '../services/socket.service';
import { FakeAuctionService } from './auctionService.mock';
import express, { type Express } from 'express';
import { Server, createServer, IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../createApp';
import { mockQueueService } from './queueService.mock';
import type {
  AuctionService,
  QueueService,
  SocketService,
  UserService,
} from '../types/services';
import type { AddressInfo } from 'net';
import { io as ClientIo, Socket } from 'socket.io-client';

export type HttpServer = Server<typeof IncomingMessage, typeof ServerResponse>;
export type IoServer = SocketIoServer<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  any
>;

type MockAppBase = {
  app: Express;
  httpServer: Server<typeof IncomingMessage, typeof ServerResponse>;
  io: SocketIoServer<
    ClientToServerEvents,
    ServerToClientEvents,
    DefaultEventsMap,
    any
  >;
};

// when useClient is true, add the client in the return object
export function getMockApp(
  useClient: true,
  params?: {
    userService?: UserService;
    auctionService?: AuctionService;
    queueService?: QueueService;
    socketService?: SocketService;
  },
): Promise<
  MockAppBase & { clientIo: Socket<ServerToClientEvents, ClientToServerEvents> }
>;

// otherwise don't return the client
export function getMockApp(
  useClient: false,
  params?: {
    userService?: UserService;
    auctionService?: AuctionService;
    queueService?: QueueService;
    socketService?: SocketService;
  },
): Promise<MockAppBase>;

export async function getMockApp(
  useClient: boolean,
  params?: any,
): Promise<any> {
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

  return new Promise((resolve) => {
    if (useClient) {
      httpServer.listen(() => {
        const address = httpServer.address() as AddressInfo;
        const port = address.port;

        const clientIo = ClientIo(`http://localhost:${port}`);
        clientIo.on('connect', () =>
          resolve({ app, httpServer, io, clientIo }),
        );
      });
    } else {
      resolve({ app, httpServer, io });
    }
  });
}
