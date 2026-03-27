import {
  AuctionJoinParams,
  AuctionJoinResponse,
  AuctionLeaveResponse,
} from './auction';
import { BidCreationParams, BidCreationResponse } from './bid';

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
  bidOnAction: (params: BidCreationParams) => void;
  joinAuction: (params: AuctionJoinParams) => void;
  leaveAuction: () => void;
}

export interface ServerToClientEvents {
  bidOnAction: (response: BidCreationResponse) => void;
  joinAuction: (response: AuctionJoinResponse) => void;
  leaveAuction: (response: AuctionLeaveResponse) => void;
}
