import { Bid } from './bid';
import { Dto } from './socket';

export interface Auction {
  auctionId: number;
  title: string;
  description: string;
  startingPriceCents: string;
  startTimeUtc: Date;
  endTimeUtc: Date;
  active: boolean;
}

export type AuctionCreateParams = Pick<
  Auction,
  'title' | 'description' | 'startingPriceCents' | 'endTimeUtc'
>;

// TODO: Fill this out
export interface AuctionSearchParams {
  active?: boolean;
  query?: string;
  minPriceInCents?: number;
  maxPriceInCents?: number;
}

export interface AuctionJoinParams {
  auctionId: Auction['auctionId'];
}

export type AuctionJoinResponse = Dto<{ bids: Bid[]; auction: Auction }>;

export type AuctionLeaveResponse = Dto<null>;

export interface AuctionWithBids extends Auction {
  bids: Bid[];
}
