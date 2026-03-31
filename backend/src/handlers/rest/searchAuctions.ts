import type { Request, Response } from 'express';
import type { AuctionService } from '../../types/services';

export function searchAuctions(auctionService: AuctionService) {
  return async (req: Request, res: Response) => {
    const auctions = await auctionService.searchAuctions({} as any);

    return res.status(200).json(auctions);
  };
}
