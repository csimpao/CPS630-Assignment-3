import type {
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  AuctionWithBids,
  Bid,
  BidCreationParams,
} from '@auction-platform/shared/domain';
import type { AuctionService } from '../types/services';
import { AuctionModel } from '../models/Auction';
import { UserModel } from '../models/User';

function docToAuction(doc: any): Auction {
  return {
    auctionId: doc.auctionId,
    title: doc.title,
    description: doc.description,
    startingPriceCents: doc.startingPriceCents,
    startTimeUtc: doc.startTimeUtc,
    endTimeUtc: doc.endTimeUtc,
    active: doc.active,
  };
}

function docToAuctionWithBids(doc: any): AuctionWithBids {
  return {
    ...docToAuction(doc),
    bids: (doc.bids ?? []).map((b: any) => ({
      bidId: b.bidId,
      auctionId: b.auctionId,
      userId: b.userId,
      bidInCents: b.bidInCents,
      bidTimeUtc: b.bidTimeUtc,
    })),
  };
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class MongoAuctionService implements AuctionService {
  public async createAuction(params: AuctionCreateParams): Promise<Auction> {
    const maxAuction = await AuctionModel.findOne().sort({ auctionId: -1 });
    const auctionId = maxAuction ? maxAuction.auctionId + 1 : 1;

    const doc = await AuctionModel.create({
      auctionId,
      title: params.title,
      description: params.description,
      startingPriceCents: params.startingPriceCents,
      startTimeUtc: new Date(),
      endTimeUtc: params.endTimeUtc,
      active: true,
      bids: [],
    });

    return docToAuction(doc);
  }

  public async searchAuctions(
    params: AuctionSearchParams,
  ): Promise<AuctionWithBids[]> {
    const { active, query, minPriceInCents, maxPriceInCents } = params;

    const filter: Record<string, unknown> = {};
    if (active !== undefined) {
      filter.active = active;
    }
    if (query !== undefined) {
      const regex = new RegExp(escapeRegex(query), 'i');
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const docs = await AuctionModel.find(filter);

    const filteredByPrice = docs.filter((doc) => {
      const lastBid = doc.bids.length > 0 ? doc.bids[doc.bids.length - 1] : undefined;
      const currentPrice = lastBid ? lastBid.bidInCents : doc.startingPriceCents;

      if (minPriceInCents !== undefined && currentPrice < minPriceInCents) {
        return false;
      }
      if (maxPriceInCents !== undefined && currentPrice > maxPriceInCents) {
        return false;
      }
      return true;
    });

    return filteredByPrice.map(docToAuctionWithBids);
  }

  public async getAuction(
    auctionId: Auction['auctionId'],
  ): Promise<AuctionWithBids | null> {
    const doc = await AuctionModel.findOne({ auctionId });
    if (!doc) return null;
    return docToAuctionWithBids(doc);
  }

  public async processAuctionClosure(
    auctionId: Auction['auctionId'],
  ): Promise<void> {
    await AuctionModel.updateOne({ auctionId }, { $set: { active: false } });
  }

  public async placeBid(params: BidCreationParams): Promise<Bid | null> {
    const { auctionId, bidInCents, userId } = params;

    const doc = await AuctionModel.findOne({ auctionId });
    if (!doc) {
      return null;
    }

    const lastBid = doc.bids.length > 0 ? doc.bids[doc.bids.length - 1] : undefined;
    const floor = lastBid ? lastBid.bidInCents : doc.startingPriceCents;
    if (bidInCents <= floor) {
      return null;
    }

    const user = await UserModel.findOne({ userId });
    if (!user || user.balanceInCents < bidInCents) {
      return null;
    }

    const bidId = auctionId * 1_000_000 + doc.bids.length + 1;
    const bid: Bid = {
      bidId,
      auctionId,
      userId,
      bidInCents,
      bidTimeUtc: new Date(),
    };

    await AuctionModel.updateOne({ auctionId }, { $push: { bids: bid } });
    await UserModel.updateOne(
      { userId },
      {
        $addToSet: { participatedAuctions: auctionId },
        $inc: { balanceInCents: -bidInCents },
      },
    );

    return bid;
  }
}
