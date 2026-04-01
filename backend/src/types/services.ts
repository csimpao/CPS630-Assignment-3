import type {
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  Bid,
  BidCreationParams,
  User,
  UserCreateParams,
  UserAddBalanceParams,
  AuctionWithBids,
} from '@auction-platform/shared/domain';

/**
 * UserService handles the creation and updating of users in the database.
 */
export interface UserService {
  /**
   * createUser creates a user with the specified information,
   * returning the user if successful.
   * @param params The user to be created
   * @returns The created user's information
   */
  createUser: (params: UserCreateParams) => Promise<User>;

  /**
   * addToUserBalance adds the specified amount to the specified user's balance.
   * @param params
   * @returns
   */
  addToUserBalance: (params: UserAddBalanceParams) => Promise<User>;

  /**
   * getUser retrieves the user with the specified user id, if they exist.
   * @param userId The user to be retrieved
   * @returns The user's information
   */
  getUser: (userId: User['userId']) => Promise<User>;
}

/**
 * AuctionService handles the lifecycle of auctions, including creation,
 * discovery, bidding, and state transitions.
 */
export interface AuctionService {
  /**
   * Creates a new auction listing based on the provided parameters.
   * @param params The details of the auction to be created
   * @returns The newly created auction object
   */
  createAuction: (params: AuctionCreateParams) => Promise<Auction>;

  /**
   * Retrieves a list of auctions based on filtering and search criteria.
   * @param params Search filters
   * @returns An array of auctions matching the search parameters
   */
  searchAuctions: (params: AuctionSearchParams) => Promise<Auction[]>;

  /**
   * Retrieves the specified auction
   * @param auctionId The auctionId
   * @returns The specified auction
   */
  getAuction: (
    auctionId: Auction['auctionId'],
  ) => Promise<AuctionWithBids | null>;

  /**
   * Finalizes an auction once its end time has passed. This involves
   * determining the winner and updating the auction's final status
   * @param auctionId The unique identifier of the auction to close
   */
  processAuctionClosure: (auctionId: Auction['auctionId']) => Promise<void>;

  /**
   * Submits a new bid for a specific auction. Validates the bid amount
   * against the current highest bid before persisting.
   * @param auctionId The unique identifier of the auction
   * @param params The bid amount and bidder information
   * @returns The successfully placed bid
   */
  placeBid: (params: BidCreationParams) => Promise<Bid | null>;
}

/**
 * SocketService broadcasts real-time messages to connected clients.
 */
export interface SocketService {
  /**
   * Notifies all interested clients that a specific auction has concluded.
   * @param auctionId The unique identifier of the finished auction
   */
  notifyAuctionEnd: (auctionId: Auction['auctionId']) => Promise<void>;

  /**
   * Broadcasts a new bid event to connected clients so the UI
   * can update the current price in real-time.
   * @param auctionId The unique identifier of the auction receiving the bid
   * @param bid The bid details to be broadcasted
   */
  notifyBid: (auctionId: Auction['auctionId'], bid: Bid) => Promise<void>;
}

/**
 * QueueService manages background tasks, specifically tracking
 * auction durations and triggering end-of-auction logic via workers.
 */
export interface QueueService {
  /**
   * Schedules a delayed task to trigger the auction end logic
   * at the specified UTC timestamp.
   * @param auctionId The auction to be queued for closure
   * @param endTimeUtc The exact time the auction should conclude
   */
  scheduleAuctionEnd: (
    auctionId: Auction['auctionId'],
    endTimeUtc: Auction['endTimeUtc'],
  ) => Promise<void>;

  /**
   * Initializes the background worker to listen for and process
   * scheduled auction completions.
   * @param processor A callback function that executes the closure logic for a given auction ID
   */
  startWorker: (
    processor: (auctionId: Auction['auctionId']) => Promise<void>,
  ) => void;

  /**
   * Gracefully shuts down the background worker and finishes
   * any active processing tasks.
   */
  stopWorker: () => Promise<void>;
}
