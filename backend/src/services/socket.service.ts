import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/socket';
import type { AuctionService, SocketService } from '../types/services';
import type { Server } from 'socket.io';
import type { Auction, Bid } from '@auction-platform/shared';
import { getAuctionRoom } from '../lib/getAuctionRoom';

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
    this.io.to(getAuctionRoom(auctionId)).emit('endAuction', auction);
  }

  public async notifyBid(
    auctionId: Auction['auctionId'],
    bid: Bid,
  ): Promise<void> {
    this.io.to(getAuctionRoom(auctionId)).emit('receiveBidOnAction', bid);
  }
}
