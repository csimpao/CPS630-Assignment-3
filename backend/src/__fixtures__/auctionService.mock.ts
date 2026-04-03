import type {
  Auction,
  AuctionCreateParams,
  AuctionSearchParams,
  AuctionWithBids,
  Bid,
  BidCreationParams,
} from '@auction-platform/shared/domain';
import type { AuctionService } from '../types/services';

export class FakeAuctionService implements AuctionService {
  private auctions: AuctionWithBids[];
  private currentAuctionId: Auction['auctionId'];
  private currentBidId: Bid['bidId'];

  constructor() {
    this.auctions = [];
    this.currentAuctionId = 0;
    this.currentBidId = 0;
  }

  public async createAuction(params: AuctionCreateParams): Promise<Auction> {
    this.currentAuctionId += 1;
    const auction: AuctionWithBids = {
      ...params,
      active: true,
      auctionId: this.currentAuctionId,
      startTimeUtc: new Date(),
      bids: [],
    };
    this.auctions.push(auction);

    return auction;
  }

  public async searchAuctions(params: AuctionSearchParams): Promise<Auction[]> {
    const { active, query, minPriceInCents, maxPriceInCents } = params;
    let filteredItems = this.auctions;

    if (active !== undefined) {
      if (active) {
        filteredItems = filteredItems.filter((auction) => auction.active);
      } else {
        filteredItems = filteredItems.filter((auction) => !auction.active);
      }
    }

    if (query !== undefined) {
      filteredItems = filteredItems.filter((auction) => {
        const allStrings = auction.title + ' ' + auction.description;
        return allStrings.includes(query);
      });
    }

    if (minPriceInCents !== undefined) {
      filteredItems = filteredItems.filter((auction) => {
        if (auction.bids.length > 0) {
          return auction.bids[-1]!.bidInCents >= minPriceInCents;
        } else {
          return auction.startingPriceCents >= minPriceInCents;
        }
      });
    }

    if (maxPriceInCents !== undefined) {
      filteredItems = filteredItems.filter((auction) => {
        if (auction.bids.length > 0) {
          return auction.bids[-1]!.bidInCents <= maxPriceInCents;
        } else {
          return auction.startingPriceCents <= maxPriceInCents;
        }
      });
    }

    return filteredItems;
  }

  public async getAuction(
    auctionId: Auction['auctionId'],
  ): Promise<AuctionWithBids | null> {
    const result = this.auctions.find(
      (auction) => auction.auctionId === auctionId,
    );

    return result ?? null;
  }

  public async processAuctionClosure(
    auctionId: Auction['auctionId'],
  ): Promise<void> {
    const auctionIdx = this.auctions.findIndex(
      (auction) => auction.auctionId === auctionId,
    );

    if (auctionIdx === -1) {
      return;
    }

    this.auctions[auctionIdx]!.active = false; // we found it above
  }

  public async placeBid(params: BidCreationParams): Promise<Bid | null> {
    const { auctionId, bidInCents, userId } = params;

    const auction = this.auctions.find(
      (auction) => auction.auctionId === auctionId,
    );
    if (!auction) {
      return null;
    }

    const lastBid = auction.bids[auction.bids.length - 1];
    if (lastBid) {
      if (lastBid.bidInCents >= bidInCents) {
        return null;
      }
    } else {
      if (auction.startingPriceCents >= bidInCents) {
        return null;
      }
    }

    this.currentBidId += 1;
    const bid: Bid = {
      auctionId,
      bidInCents,
      userId,
      bidId: this.currentBidId,
      bidTimeUtc: new Date(),
    };
    auction.bids.push(bid);
    return bid;
  }
}
