import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@todo-app/shared/socket';
import type { AuctionService, SocketService } from '../types/services';
import type { Server } from 'socket.io';
import type { Auction, Bid } from '@todo-app/shared';

export class SocketIoSocketService implements SocketService {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private auctionService: AuctionService;

  constructor(
    io: Server<ClientToServerEvents, ServerToClientEvents>,
    auctionService: AuctionService,
  ) {
    this.io = io;
    this.auctionService = auctionService;
  }

  public async notifyAuctionEnd(
    auctionId: Auction['auctionId'],
  ): Promise<void> {
    const auction = await this.auctionService.getAuction(auctionId);
    this.io.to(`auction:${auctionId}`).emit('endAuction', auction);
  }

  public async notifyBid(
    auctionId: Auction['auctionId'],
    bid: Bid,
  ): Promise<void> {
    this.io.to(`auction:${auctionId}`).emit('receiveBidOnAction', bid);
  }
}
