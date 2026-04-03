import {
  getMockApp,
  type HttpServer,
  type IoServer,
} from '../../../__fixtures__/app.mock';
import { Socket } from 'socket.io-client';
import { FakeAuctionService } from '../../../__fixtures__/auctionService.mock';
import type { AuctionJoinResponse } from '@auction-platform/shared/domain';

describe('joinAuction', () => {
  let io: IoServer;
  let httpServer: HttpServer;
  let clientIo: Socket;
  let auctionService: FakeAuctionService;

  beforeEach(async () => {
    auctionService = new FakeAuctionService();
    const mockApp = await getMockApp(true, { auctionService });
    io = mockApp.io;
    httpServer = mockApp.httpServer;
    clientIo = mockApp.clientIo;

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

  it('should join a valid auction room', (done) => {
    const auctionId = 1;

    clientIo.emit(
      'joinAuction',
      { auctionId },
      (response: AuctionJoinResponse) => {
        try {
          expect(response.status).toBe('ok');
          expect(response.payload?.auctionId).toBe(auctionId);

          // We can't directly check the server-side socket rooms from the client easily,
          // but we can check if we receive messages for that auction.
          done();
        } catch (error) {
          done(error);
        }
      },
    );
  });

  it('should return an error for a non-existent auction', (done) => {
    const auctionId = 999;

    clientIo.emit(
      'joinAuction',
      { auctionId },
      (response: AuctionJoinResponse) => {
        try {
          expect(response.status).toBe('error');
          expect(response.error).toContain('Auction could not be found');
          done();
        } catch (error) {
          done(error);
        }
      },
    );
  });

  it('should return a validation error for invalid input', (done) => {
    const auctionId = -1;

    clientIo.emit(
      'joinAuction',
      { auctionId },
      (response: AuctionJoinResponse) => {
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
});
