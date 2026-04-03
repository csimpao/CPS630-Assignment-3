import { Auction } from './auction';

export interface User {
  userId: number;
  name: string;
  balanceInCents: number;
  participatedAuctions: Auction[];
}

// TODO: Add this
export interface UserCreateParams {}

export interface UserAddBalanceParams {
  userId: User['userId'];
  addedBalanceInCents: User['balanceInCents'];
}
