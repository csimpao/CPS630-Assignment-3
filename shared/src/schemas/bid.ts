import { z } from 'zod';

export const BidCreationSchema = z.object({
  body: z.object({
    auctionId: z.number().int().min(1),
    bidInCents: z.number().int().min(1),
  }),
});
