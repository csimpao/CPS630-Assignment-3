import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { restApi } from './handlers/rest';
import type {
  AuctionService,
  QueueService,
  UserService,
} from './types/services';
import { socketApi } from './handlers/sockets';
import {
  auctionWithBidsUsedCar,
  auctionWithBidsVintageCamera,
} from '@auction-platform/shared/fixtures';
import type {
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  Bid,
  BidCreationParams,
  ClientToServerEvents,
} from '@auction-platform/shared/domain';
import { SocketIoSocketService } from './services/socket.service';
import { globalErrorHandler } from './handlers/rest/middleware';

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents>(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // TODO: configure this
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

const userService = {
  addToUserBalance: async () => ({
    userId: 1,
    name: 'John Doe',
    balanceInCents: 10000, // $100.00
    participatedAuctions: [],
  }),
} as Partial<UserService> as UserService;
const auctionService = {
  getAuction: async (auctionId: Auction['auctionId']) => {
    if (auctionId === 101) {
      return auctionWithBidsVintageCamera;
    } else {
      return auctionWithBidsUsedCar;
    }
  },
  placeBid: async (params: BidCreationParams): Promise<Bid> => {
    const bid: Bid = {
      bidId: 4,
      auctionId: params.auctionId,
      userId: 57,
      bidInCents: params.bidInCents,
      bidTimeUtc: new Date('2026-03-30T15:48:00Z'),
    };

    if (params.auctionId === 101) {
      auctionWithBidsVintageCamera.bids.push(bid);
    } else {
      auctionWithBidsUsedCar.bids.push(bid);
    }

    return bid;
  },
  createAuction: async (_params: AuctionCreateParams) => ({
    ...auctionWithBidsVintageCamera,
  }),
  searchAuctions: async (params: AuctionSearchParams) => {
    console.log(params);
    return [auctionWithBidsUsedCar, auctionWithBidsVintageCamera];
  },
} as Partial<AuctionService> as AuctionService;
const queueService = {
  scheduleAuctionEnd: async () => {},
} as Partial<QueueService> as QueueService;
const socketService = new SocketIoSocketService(io, auctionService);

// TODO: configure this
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/', restApi(userService, auctionService, queueService));
app.use(globalErrorHandler);
socketApi(userService, auctionService, queueService, socketService, io);

httpServer.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});
