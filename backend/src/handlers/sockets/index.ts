import type { Server } from 'socket.io';
import type {
  UserService,
  AuctionService,
  QueueService,
} from '../../types/services';

export function socketApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
  io: Server,
) {
  io.on('connection', (socket) => {
    console.log('socket connected');
    socket.emit('test', 'sample text');
  });
  io.on('reconnect', (socket) => {});
}
