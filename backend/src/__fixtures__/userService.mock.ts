import bcrypt from 'bcrypt';
import type {
  User,
  UserAddBalanceParams,
  UserCreateParams,
} from '@auction-platform/shared/domain';
import type { UserService } from '../types/services';

export class FakeUserService implements UserService {
  private users: Record<User['userId'], User | undefined>;
  private usersByEmail: Record<string, { user: User; passwordHash: string } | undefined>;
  private currentUserId: number;

  constructor() {
    this.users = {};
    this.usersByEmail = {};
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
    const existingEmail = this.usersByEmail[params.email.toLowerCase()];
    if (existingEmail) {
      throw new Error('Email already in use');
    }

    this.currentUserId += 1;
    const user: User = {
      name: params.name,
      balanceInCents: 0,
      userId: this.currentUserId,
      participatedAuctions: [],
    };

    const passwordHash = await bcrypt.hash(params.password, 1); // low cost for tests

    this.users[this.currentUserId] = user;
    this.usersByEmail[params.email.toLowerCase()] = { user, passwordHash };
    return user;
  }

  public async getUserByEmail(
    email: string,
  ): Promise<{ user: User; passwordHash: string } | null> {
    return this.usersByEmail[email.toLowerCase()] ?? null;
  }
}
