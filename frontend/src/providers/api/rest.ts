import type {
  User,
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  AuctionWithBids,
} from '@auction-platform/shared/domain';
import { fetcher } from '../../lib/fetcher';
import type { ApiActions } from '../../types/api';

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
    addToBalance: async (addedBalanceInCents: number): Promise<User> => {
      return await fetcher(`${baseUrl}/me/balance`, {
        method: 'PATCH',
        body: JSON.stringify({ addedBalanceInCents }),
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
export type RestApi = Pick<
  ApiActions,
  | 'getUserInfo'
  | 'addToBalance'
  | 'getAuction'
  | 'createAuction'
  | 'searchAuctions'
>;
