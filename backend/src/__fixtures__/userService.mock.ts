import type {
  User,
  UserAddBalanceParams,
  UserCreateParams,
} from '@auction-platform/shared/domain';
import type { UserService } from '../types/services';

export class FakeUserService implements UserService {
  private users: Record<User['userId'], User | undefined>;
  private currentUserId: number;

  constructor() {
    this.users = {};
    this.currentUserId = 0;
  }

  public async addToUserBalance(
    params: UserAddBalanceParams,
  ): Promise<User | null> {
    if (!this.users[params.userId]) {
      return null;
    }

    this.users[params.userId]!.balanceInCents += params.addedBalanceInCents;
    return this.users[params.userId]!;
  }

  public async getUser(userId: User['userId']): Promise<User | null> {
    return this.users[userId] ?? null;
  }

  public async createUser(params: UserCreateParams): Promise<User> {
    this.currentUserId += 1;
    const user: User = {
      ...params,
      name: 'name', // TODO: remove this
      balanceInCents: 0,
      userId: this.currentUserId,
      participatedAuctions: [],
    };

    this.users[this.currentUserId] = user;
    return user;
  }
}
