import type {
  User,
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  UserAddBalanceParams,
  AuctionWithBids,
} from '@auction-platform/shared/domain';
import { fetcher } from '../../lib/fetcher';

export const createApi = (baseUrl: string): RestApi => {
  return {
    /**
     * Retrieves the profile information for the currently authenticated user.
     */
    getUserInfo: async (): Promise<User> => {
      return await fetcher(`${baseUrl}/me`, {
        method: 'GET',
      });
    },

    /**
     * Updates the current user's account balance.
     */
    addToBalance: async (
      userAddBalanceParams: UserAddBalanceParams,
    ): Promise<User> => {
      return await fetcher(`${baseUrl}/me/balance`, {
        method: 'PATCH',
        body: JSON.stringify(userAddBalanceParams),
      });
    },

    /**
     * Fetches details for a specific auction, including its bid history.
     */
    getAuction: async (
      auctionId: Auction['auctionId'],
    ): Promise<AuctionWithBids> => {
      return await fetcher(`${baseUrl}/auctions/${auctionId}`, {
        method: 'GET',
      });
    },

    /**
     * Creates and lists a new auction.
     */
    createAuction: async (
      auctionCreateParams: AuctionCreateParams,
    ): Promise<Auction> => {
      return await fetcher(`${baseUrl}/auctions`, {
        method: 'POST',
        body: JSON.stringify(auctionCreateParams),
      });
    },

    /**
     * Searches and filters the auction catalog based on provided criteria.
     */
    searchAuctions: async (
      auctionSearchParams: AuctionSearchParams,
    ): Promise<Auction[]> => {
      const params = new URLSearchParams();
      const keys = Object.keys(
        auctionSearchParams,
      ) as (keyof AuctionSearchParams)[];

      keys.forEach((param) => {
        if (auctionSearchParams[param] !== undefined) {
          params.append(param, String(auctionSearchParams[param]));
        }
      });

      return await fetcher(`${baseUrl}/auctions?${params.toString()}`, {
        method: 'GET',
      });
    },
  };
};
export type RestApi = {
  getUserInfo: () => Promise<User>;
  addToBalance: (userAddBalanceParams: UserAddBalanceParams) => Promise<User>;
  getAuction: (auctionId: Auction['auctionId']) => Promise<AuctionWithBids>;
  createAuction: (auctionCreateParams: AuctionCreateParams) => Promise<Auction>;
  searchAuctions: (
    auctionSearchParams: AuctionSearchParams,
  ) => Promise<Auction[]>;
};
