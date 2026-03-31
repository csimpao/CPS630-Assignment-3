import type { Request, Response } from 'express';
import type { AuctionService } from '../../types/services';
import { z } from 'zod';
import type { AuctionSearchSchema } from '@auction-platform/shared/schemas';

type ValidatedData = z.infer<typeof AuctionSearchSchema>;

export function searchAuctions(auctionService: AuctionService) {
  return async (req: Request, res: Response) => {
    const params = {
      ...(req.validated as ValidatedData),
    };
    const auctions = await auctionService.searchAuctions(params);

    return res.status(200).json(auctions);
  };
}
