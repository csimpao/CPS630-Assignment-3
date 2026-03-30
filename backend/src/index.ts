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
import type { Auction, ClientToServerEvents } from '@auction-platform/shared';

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents>(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // TODO: configure this
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const userService = null as unknown as UserService;
const auctionService = {
  getAuction: async (auctionId: Auction['auctionId']) => {
    if (auctionId === 101) {
      return auctionWithBidsVintageCamera;
    } else {
      return auctionWithBidsUsedCar;
    }
  },
} as Partial<AuctionService> as AuctionService;
const queueService = null as unknown as QueueService;

// TODO: configure this
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use('/', restApi(userService, auctionService, queueService));
socketApi(userService, auctionService, queueService, io);

httpServer.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});
