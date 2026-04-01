import type { AuctionService, SocketService } from '../types/services';
import type { Server } from 'socket.io';
import { getAuctionRoom } from '../lib/getAuctionRoom';
import type {
  Auction,
  Bid,
  ClientToServerEvents,
  ServerToClientEvents,
} from '@auction-platform/shared/domain';

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
    this.io.to(getAuctionRoom(auctionId)).emit('endAuction', auction!); // the server created this auction, it must exist
  }

  public async notifyBid(
    auctionId: Auction['auctionId'],
    bid: Bid,
  ): Promise<void> {
    this.io.to(getAuctionRoom(auctionId)).emit('receiveBidOnAction', bid);
  }
}
