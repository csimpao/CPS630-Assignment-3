import { Auction } from './auction';

export interface User {
  userId: number;
  name: string;
  balanceInCents: number;
  participatedAuctions: Auction[];
}

export interface UserCreateParams {
  name: string;
  email: string;
  password: string;
}

export interface UserAddBalanceParams {
  userId: User['userId'];
  addedBalanceInCents: User['balanceInCents'];
}
