import type {
  User,
  AuctionCreateParams,
  Auction,
  AuctionWithBids,
  AuctionSearchParams,
  Bid,
  BidCreationParams,
  UserAddBalanceParams,
} from '@auction-platform/shared/domain';

/**
 * @interface ApiActions
 * @description The collection of available methods to interact with the backend services.
 */
export interface ApiActions {
  // rest api actions

  /**
   * Fetches the profile and associated auctions for the current user.
   * @returns {Promise<User>} A promise resolving to the User object
   */
  getUserInfo: () => Promise<User>;

  /**
   * Increases the user's account balance.
   * @param {UserAddBalanceParams} userAddBalanceParams - The amount to the add
   * @returns {Promise<User>} The updated User object reflecting the new balance
   */
  addToBalance: (userAddBalanceParams: UserAddBalanceParams) => Promise<User>;

  /**
   * Lists a new item for auction.
   * @param {AuctionCreateParams} auctionCreateParams - The configuration for the new auction
   * @returns {Promise<Auction>} The newly created auction details
   */
  createAuction: (auctionCreateParams: AuctionCreateParams) => Promise<Auction>;

  /**
   * Retrieves full details for a specific auction, including its bid history.
   * @param {Auction['auctionId']} auctionId - The unique identifier of the auction
   * @returns {Promise<AuctionWithBids>}
   */
  getAuction: (auctionId: Auction['auctionId']) => Promise<AuctionWithBids>;

  /**
   * Performs a filtered search for auctions based on criteria like category or status.
   * @param {AuctionSearchParams} auctionSearchParams - Filter parameters
   * @returns {Promise<Auction[]>} A list of auctions matching the criteria
   */
  searchAuctions: (
    auctionSearchParams: AuctionSearchParams,
  ) => Promise<Auction[]>;

  // websocket actions

  /**
   * Places a bid on a specific auction via a real-time socket connection.
   * @param {BidCreationParams} bidCreationParams - Details of the bid (amount, auction ID)
   * @returns {Promise<void>} Resolves when the bid command is sent
   */
  bidOnAuction: (bidCreationParams: BidCreationParams) => Promise<void>;

  /**
   * Subscribes the user to real-time updates for a specific auction.
   * This typically triggers a 'room join' on the server.
   * @param {Auction['auctionId']} auctionId - The ID of the auction to watch
   * @returns {Promise<void>}
   */
  joinAuction: (auctionId: Auction['auctionId']) => Promise<void>;

  /**
   * Unsubscribes from the current auction real-time room.
   * @returns {Promise<void>}
   */
  leaveAuction: () => Promise<void>;
}

/**
 * @interface ApiProvider
 * @description The global state shape for the API context provider.
 */
export interface ApiProvider {
  /** The implementation of the API methods. */
  api: ApiActions;

  /** * A reactive list of bids for the currently viewed auction.
   * Updated automatically via WebSockets.
   */
  relevantBids: Bid[];

  /** Indicates the current health of the WebSocket connection. */
  isSocketConnected: boolean;

  /** The ID of the auction the user is currently "joined" to. */
  currentAuctionId: Auction['auctionId'] | null;

  /** The hydrated data for the currently active auction. */
  currentAuction: Auction | null;
}
