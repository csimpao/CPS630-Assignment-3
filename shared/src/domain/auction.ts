import { Bid } from './bid';
import { Dto } from './socket';

export interface Auction {
  auctionId: number;
  title: string;
  description: string;
  startingPriceCents: number;
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
  active?: boolean | undefined;
  query?: string | undefined;
  minPriceInCents?: number | undefined;
  maxPriceInCents?: number | undefined;
}

export interface AuctionJoinParams {
  auctionId: Auction['auctionId'];
}

export type AuctionJoinResponse = Dto<AuctionWithBids>;

export type AuctionLeaveResponse = Dto<null>;

export interface AuctionWithBids extends Auction {
  bids: Bid[];
}
