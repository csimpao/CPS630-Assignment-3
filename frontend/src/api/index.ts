import type {
  User,
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  UserAddBalanceParams,
  AuctionWithBids,
} from '@auction-platform/shared';
import { fetcher } from './fetcher';

const BASE_URL = import.meta.env.BASE_URL || 'http://localhost:3000';

/**
 * Retrieves the profile information for the currently authenticated user.
 * @returns {Promise<User>} The current user's data
 * @throws {Error} If the request fails or the user is unauthorized
 */
const getUserInfo = async (): Promise<User> => {
  return await fetcher(`${BASE_URL}/me`, {
    method: 'GET',
  });
};

/**
 * Updates the current user's account balance.
 * @param {UserAddBalanceParams} userAddBalanceParams - Data containing the amount to add
 * @returns {Promise<User>} The updated user object with the new balance
 */
const addToBalance = async (
  userAddBalanceParams: UserAddBalanceParams,
): Promise<User> => {
  return await fetcher(`${BASE_URL}/me/balance`, {
    method: 'PATCH',
    body: JSON.stringify(userAddBalanceParams),
  });
};

/**
 * Fetches details for a specific auction, including its bid history.
 * @param {Auction['auctionId']} auctionId - The unique identifier of the auction
 * @returns {Promise<AuctionWithBids>} The auction details and associated bids
 */
const getAuction = async (
  auctionId: Auction['auctionId'],
): Promise<AuctionWithBids> => {
  return await fetcher(`${BASE_URL}/auctions/${auctionId}`, {
    method: 'GET',
  });
};

/**
 * Creates and lists a new auction.
 * @param {AuctionCreateParams} auctionCreateParams - The details for the new auction listing
 * @returns {Promise<Auction>} The newly created auction object
 */
const createAuction = async (
  auctionCreateParams: AuctionCreateParams,
): Promise<Auction> => {
  return await fetcher(`${BASE_URL}/auctions`, {
    method: 'POST',
    body: JSON.stringify(auctionCreateParams),
  });
};

/**
 * Searches and filters the auction catalog based on provided criteria.
 * @param {AuctionSearchParams} auctionSearchParams - Filter criteria (e.g., category, query)
 * @returns {Promise<Auction[]>} A list of auctions matching the search parameters
 */
const searchAuctions = async (
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

  return await fetcher(`${BASE_URL}/auctions?${params.toString()}`, {
    method: 'GET',
  });
};

export const api = {
  getUserInfo,
  addToBalance,
  createAuction,
  getAuction,
  searchAuctions,
};
export type Api = typeof api;
