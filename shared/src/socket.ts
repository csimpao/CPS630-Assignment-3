import {
  Auction,
  AuctionJoinParams,
  AuctionJoinResponse,
  AuctionLeaveResponse,
  AuctionWithBids,
} from './auction';
import { Bid, BidCreationParams, BidCreationResponse } from './bid';

export type Dto<T> =
  | {
      status: 'ok';
      payload: T;
      error: null;
    }
  | {
      status: 'error';
      payload: null;
      error: string;
    };

export interface ClientToServerEvents {
  bidOnAction: (
    params: BidCreationParams,
    cb: (response: BidCreationResponse) => void,
  ) => void;
  joinAuction: (
    params: AuctionJoinParams,
    cb: (response: AuctionJoinResponse) => void,
  ) => void;
  leaveAuction: (cb: (response: AuctionLeaveResponse) => void) => void;
}

export interface ServerToClientEvents {
  receiveBidOnAction: (bid: Bid) => void;
  endAuction: (auction: AuctionWithBids) => void;
}
