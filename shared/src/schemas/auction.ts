import { z } from 'zod';

export const AuctionCreateSchema = z.object({
  title: z.string().min(1).max(128),
  description: z.string().min(1).max(3000),
  startingPriceCents: z.number().int().min(1),
  endTimeUtc: z.coerce.date().refine(
    (date) => {
      const oneHourFromNow = new Date(Date.now() + 1 * 60 * 60 * 1000);
      return date >= oneHourFromNow;
    },
    { message: 'Auction must last at least 1 hour' },
  ),
});

export const AuctionGetSchema = z.object({
  auctionId: z.coerce.number().int().min(1),
});

export const AuctionSearchSchema = z.object({
  active: z
    .union([z.boolean(), z.enum(['true', 'false'])])
    .transform((val) => (typeof val === 'boolean' ? val : val === 'true'))
    .optional(),
  query: z.string().min(1).max(128).optional(),
  minPriceInCents: z.coerce.number().int().min(1).optional(),
  maxPriceInCents: z.coerce.number().int().min(1).optional(),
});
