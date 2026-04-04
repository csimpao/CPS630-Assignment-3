import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { QueueService } from './types/services';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/domain';
import { SocketIoSocketService } from './services/socket.service';
import { MongoUserService } from './services/user.service';
import { FakeAuctionService } from './__fixtures__/auctionService.mock';
import { createApp } from './createApp';
import { connectDb } from './db';

const PORT = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const userService = new MongoUserService();
const auctionService = new FakeAuctionService();
const queueService = {
  scheduleAuctionEnd: async () => {},
} as Partial<QueueService> as QueueService;
const socketService = new SocketIoSocketService(io, auctionService);

createApp(app, io, userService, auctionService, queueService, socketService);

connectDb().then(() => {
  httpServer.listen(PORT, () => {
    console.log('listening on port: ', PORT);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});
