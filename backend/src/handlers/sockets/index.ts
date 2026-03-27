import type { DefaultEventsMap, Server } from 'socket.io';
import type {
  UserService,
  AuctionService,
  QueueService,
} from '../../types/services';
import type { ClientToServerEvents } from '@todo-app/shared/socket';

export function socketApi(
  userService: UserService,
  auctionService: AuctionService,
  queueService: QueueService,
  io: Server<ClientToServerEvents, ClientToServerEvents, DefaultEventsMap, any>,
) {
  io.on('connection', (socket) => {
    console.log('socket connected');
    socket.emit('test', 'sample text');
  });
  io.on('reconnect', (socket) => {});
}
