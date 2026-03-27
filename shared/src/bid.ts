import { Auction } from './auction';
import { Dto } from './socket';
import { User } from './user';

export interface Bid {
  bidId: number;
  auctionId: Auction['auctionId'];
  userId: User['userId'];
  bidInCents: number;
  bidTimeUtc: Date;
}

export interface BidCreationParams {
  auctionId: Auction['auctionId'];
  bidInCents: number;
}

export type BidCreationResponse = Dto<Bid>;
