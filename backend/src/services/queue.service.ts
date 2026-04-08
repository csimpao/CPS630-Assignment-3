import type { Auction } from '@auction-platform/shared/domain';
import type { QueueService } from '../types/services';
import { AuctionModel } from '../models/Auction';

export class LocalQueueService implements QueueService {
  private timers: Map<Auction['auctionId'], NodeJS.Timeout>;
  private processor: ((id: Auction['auctionId']) => Promise<void>) | null;

  constructor() {
    this.timers = new Map();
    this.processor = null;
  }

  public async scheduleAuctionEnd(
    auctionId: Auction['auctionId'],
    endTimeUtc: Auction['endTimeUtc'],
  ): Promise<void> {
    const delay = Math.max(0, endTimeUtc.getTime() - Date.now());

    const existing = this.timers.get(auctionId);
    if (existing) {
      clearTimeout(existing);
    }

    const handle = setTimeout(() => {
      this.timers.delete(auctionId);
      if (this.processor) {
        this.processor(auctionId).catch((err) => {
          console.error('auction closure failed for', auctionId, err);
        });
      }
    }, delay);

    this.timers.set(auctionId, handle);
  }

  public startWorker(
    processor: (id: Auction['auctionId']) => Promise<void>,
  ): void {
    this.processor = processor;

    // Restart recovery: re-schedule any auctions still marked active so we
    // don't lose pending closures across server restarts.
    AuctionModel.find({ active: true })
      .then((docs) => {
        for (const doc of docs) {
          this.scheduleAuctionEnd(doc.auctionId, doc.endTimeUtc);
        }
      })
      .catch((err) => {
        console.error('queue restart-recovery failed', err);
      });
  }

  public async stopWorker(): Promise<void> {
    for (const handle of this.timers.values()) {
      clearTimeout(handle);
    }
    this.timers.clear();
    this.processor = null;
  }
}
