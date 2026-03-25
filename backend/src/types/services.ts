import type {
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  Bid,
  BidCreationParams,
  User,
  UserCreateParams,
  UserUpdateBalanceParams,
} from '@auction-platform/shared';

/**
 *
 */
export interface UserService {
  createUser: (params: UserCreateParams) => Promise<User>;
  updateUserBalance: (params: UserUpdateBalanceParams) => Promise<User>;
  getUser: (userId: User['userId']) => Promise<User>;
  getUserAuctions: (userId: User['userId']) => Promise<Auction[]>;
}

export interface AuctionService {
  createAuction: (params: AuctionCreateParams) => Promise<Auction>;
  getAuctions: (params: AuctionSearchParams) => Promise<Auction[]>;
  processAuctionClosure: (auctionId: Auction['auctionId']) => Promise<void>;
  placeBid: (
    auctionId: Auction['auctionId'],
    params: BidCreationParams,
  ) => Promise<Bid>;
}

export interface SocketService {
  notifyAuctionEnd: (auctionId: Auction['auctionId']) => Promise<void>;
  notifyBid: (auctionId: Auction['auctionId'], bid: Bid) => Promise<void>;
}

export interface QueueService {
  scheduleAuctionEnd: (
    auctionId: Auction['auctionId'],
    endTimeUtc: Auction['endTimeUtc'],
  ) => Promise<void>;
  startWorker: (
    processor: (auctionId: Auction['auctionId']) => Promise<void>,
  ) => void;
  stopWorker: () => Promise<void>;
}
