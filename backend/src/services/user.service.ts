import bcrypt from 'bcrypt';
import type {
  User,
  UserCreateParams,
  UserAddBalanceParams,
} from '@auction-platform/shared/domain';
import type { UserService } from '../types/services';
import { UserModel } from '../models/User';

const SALT_ROUNDS = 10;

function docToUser(doc: any): User {
  return {
    userId: doc.userId,
    name: doc.name,
    balanceInCents: doc.balanceInCents,
    participatedAuctions: doc.participatedAuctions ?? [],
  };
}

export class MongoUserService implements UserService {
  public async createUser(params: UserCreateParams): Promise<User> {
    const existing = await UserModel.findOne({ email: params.email });
    if (existing) {
      throw new Error('Email already in use');
    }

    const maxUser = await UserModel.findOne().sort({ userId: -1 });
    const userId = maxUser ? maxUser.userId + 1 : 1;

    const passwordHash = await bcrypt.hash(params.password, SALT_ROUNDS);

    const doc = await UserModel.create({
      userId,
      name: params.name,
      email: params.email,
      passwordHash,
      balanceInCents: 0,
      participatedAuctions: [],
    });

    return docToUser(doc);
  }

  public async getUser(userId: User['userId']): Promise<User | null> {
    const doc = await UserModel.findOne({ userId });
    if (!doc) return null;
    return docToUser(doc);
  }

  public async addToUserBalance(
    params: UserAddBalanceParams,
  ): Promise<User | null> {
    const doc = await UserModel.findOneAndUpdate(
      { userId: params.userId },
      { $inc: { balanceInCents: params.addedBalanceInCents } },
      { new: true },
    );
    if (!doc) return null;
    return docToUser(doc);
  }

  public async getUserByEmail(
    email: string,
  ): Promise<{ user: User; passwordHash: string } | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    if (!doc) return null;
    return { user: docToUser(doc), passwordHash: doc.passwordHash };
  }
}
