import {
  getMockApp,
  type HttpServer,
  type IoServer,
} from '../../../__fixtures__/app.mock';
import { Socket } from 'socket.io-client';
import { FakeAuctionService } from '../../../__fixtures__/auctionService.mock';
import type { BidCreationResponse } from '@auction-platform/shared/domain';

describe('bidOnAuction', () => {
  let httpServer: HttpServer;
  let clientIo: Socket;
  let auctionService: FakeAuctionService;

  beforeEach(async () => {
    auctionService = new FakeAuctionService();
    const mockApp = await getMockApp(true, { auctionService });
    httpServer = mockApp.httpServer;
    clientIo = mockApp.clientIo;

    // Create a mock auction
    await auctionService.createAuction({
      title: 'Test Auction',
      description: 'Test Description',
      startingPriceCents: 100,
      endTimeUtc: new Date(Date.now() + 100000),
    });
  });

  afterEach(() => {
    if (clientIo.connected) {
      clientIo.disconnect();
    }
    httpServer.close();
  });

  it('should place a valid bid', (done) => {
    const auctionId = 1;
    const bidInCents = 150;

    clientIo.emit(
      'bidOnAction',
      auctionId,
      bidInCents,
      (response: BidCreationResponse) => {
        try {
          expect(response.status).toBe('ok');
          expect(response.payload).toMatchObject({
            auctionId,
            bidInCents,
            userId: 1,
          });
          done();
        } catch (error) {
          done(error);
        }
      },
    );
  });

  it('should return an error for a bid that is too low', (done) => {
    const auctionId = 1;
    const bidInCents = 50; // Starting price is 100

    clientIo.emit(
      'bidOnAction',
      auctionId,
      bidInCents,
      (response: BidCreationResponse) => {
        try {
          expect(response.status).toBe('error');
          expect(response.error).toContain(
            'Bid failed to be placed on auction',
          );
          done();
        } catch (error) {
          done(error);
        }
      },
    );
  });

  it('should return an error for a non-existent auction', (done) => {
    const auctionId = 999;
    const bidInCents = 150;

    clientIo.emit(
      'bidOnAction',
      auctionId,
      bidInCents,
      (response: BidCreationResponse) => {
        try {
          expect(response.status).toBe('error');
          expect(response.error).toContain(
            'Bid failed to be placed on auction',
          );
          done();
        } catch (error) {
          done(error);
        }
      },
    );
  });

  it('should return a validation error for invalid input', (done) => {
    const auctionId = -1; // Invalid ID
    const bidInCents = 150;

    clientIo.emit(
      'bidOnAction',
      auctionId,
      bidInCents,
      (response: BidCreationResponse) => {
        try {
          expect(response.status).toBe('error');
          expect(response.error).toContain('Invalid input');
          done();
        } catch (error) {
          done(error);
        }
      },
    );
  });

  it('should notify other clients in the same auction room', (done) => {
    const auctionId = 1;
    const bidInCents = 200;

    // Join the auction room first
    clientIo.emit('joinAuction', { auctionId }, () => {
      clientIo.on('receiveBidOnAction', (bid) => {
        try {
          expect(bid).toMatchObject({
            auctionId,
            bidInCents,
          });
          done();
        } catch (error) {
          done(error);
        }
      });

      clientIo.emit(
        'bidOnAction',
        auctionId,
        bidInCents,
        (response: BidCreationResponse) => {
          expect(response.status).toBe('ok');
        },
      );
    });
  });
});
