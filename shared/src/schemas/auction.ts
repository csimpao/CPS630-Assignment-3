import { z } from 'zod';

export const AuctionCreateSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(128),
    description: z.string().min(1).max(3000),
    startingPriceCents: z.number().int().min(1),
    endTimeUtc: z.coerce.date().refine(
      (date) => {
        const sixHoursFromNow = new Date(Date.now() + 6 * 60 * 60 * 1000);
        return date >= sixHoursFromNow;
      },
      { message: 'Auction must last at least 6 hours' },
    ),
  }),
});

export const AuctionGetSchema = z.object({
  params: z.object({
    auctionId: z.coerce.number().int().min(1),
  }),
});

export const AuctionSearchSchema = z.object({
  query: z.object({
    active: z.coerce.boolean().optional(),
    query: z.string().min(1).max(128).optional(),
    minPriceInCents: z.coerce.number().int().min(1).optional(),
    maxPriceInCents: z.coerce.number().int().min(1).optional(),
  }),
});
