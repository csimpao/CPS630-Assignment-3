import type { Request, Response } from 'express';
import type { AuctionService, QueueService } from '../../types/services';

export function createAuction(
  auctionService: AuctionService,
  queueService: QueueService,
) {
  return async (req: Request, res: Response) => {
    const auction = await auctionService.createAuction({} as any);
    await queueService.scheduleAuctionEnd(
      auction.auctionId,
      auction.endTimeUtc,
    );

    return res.status(201).json(auction);
  };
}
