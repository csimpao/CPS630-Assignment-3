import type { Request, Response } from 'express';
import type { AuctionService, QueueService } from '../../types/services';
import type { AuctionCreateSchema } from '@auction-platform/shared/schemas';
import { z } from 'zod';

type ValidatedData = z.infer<typeof AuctionCreateSchema>;

export function createAuction(
  auctionService: AuctionService,
  queueService: QueueService,
) {
  return async (req: Request, res: Response) => {
    const params = {
      ...(req.validated as ValidatedData),
    };

    const auction = await auctionService.createAuction(params);
    await queueService.scheduleAuctionEnd(
      auction.auctionId,
      auction.endTimeUtc,
    );

    return res.status(201).json(auction);
  };
}
