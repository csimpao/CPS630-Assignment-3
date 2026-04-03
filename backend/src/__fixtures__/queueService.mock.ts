import type { QueueService } from '../types/services';

export const mockQueueService: QueueService = {
  scheduleAuctionEnd: jest.fn(),
  startWorker: jest.fn(),
  stopWorker: jest.fn(),
};
