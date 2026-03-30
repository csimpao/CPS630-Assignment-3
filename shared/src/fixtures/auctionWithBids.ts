import { AuctionWithBids } from '../auction';

export const auctionWithBidsVintageCamera: AuctionWithBids = {
  auctionId: 101,
  title: 'Vintage 1960s Film Camera',
  description:
    'A well-maintained 35mm SLR camera with original leather case and 50mm lens.',
  startingPriceCents: 5000,
  startTimeUtc: new Date('2026-03-30T10:00:00Z'),
  endTimeUtc: new Date('2026-04-05T20:00:00Z'),
  active: true,

  bids: [
    {
      bidId: 1,
      auctionId: 101,
      userId: 42,
      bidInCents: 5500,
      bidTimeUtc: new Date('2026-03-30T14:30:00Z'),
    },
    {
      bidId: 2,
      auctionId: 101,
      userId: 88,
      bidInCents: 6200,
      bidTimeUtc: new Date('2026-03-31T09:15:00Z'),
    },
    {
      bidId: 3,
      auctionId: 101,
      userId: 42,
      bidInCents: 7500,
      bidTimeUtc: new Date('2026-03-31T18:45:00Z'),
    },
  ],
};

export const auctionWithBidsUsedCar: AuctionWithBids = {
  auctionId: 202,
  title: '2015 Honda Civic EX',
  description:
    'Reliable daily driver with 85,000 miles. Clean title, minor cosmetic wear on rear bumper, recently serviced with new brake pads.',
  startingPriceCents: 450000,
  startTimeUtc: new Date('2026-03-30T08:00:00Z'),
  endTimeUtc: new Date('2026-04-06T18:00:00Z'),
  active: true,

  bids: [
    {
      bidId: 10,
      auctionId: 202,
      userId: 15,
      bidInCents: 475000,
      bidTimeUtc: new Date('2026-03-30T11:20:00Z'),
    },
    {
      bidId: 11,
      auctionId: 202,
      userId: 33,
      bidInCents: 510000,
      bidTimeUtc: new Date('2026-03-30T15:45:00Z'),
    },
    {
      bidId: 12,
      auctionId: 202,
      userId: 15,
      bidInCents: 525000,
      bidTimeUtc: new Date('2026-03-31T09:00:00Z'),
    },
  ],
};
