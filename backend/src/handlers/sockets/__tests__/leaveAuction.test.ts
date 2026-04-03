import {
  getMockApp,
  type HttpServer,
  type IoServer,
} from '../../../__fixtures__/app.mock';
import { Socket } from 'socket.io-client';
import { FakeAuctionService } from '../../../__fixtures__/auctionService.mock';
import type {
  AuctionLeaveResponse,
  BidCreationResponse,
} from '@auction-platform/shared/domain';

describe('leaveAuction', () => {
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

  it('should leave all auction rooms', (done) => {
    const auctionId = 1;

    // Join first
    clientIo.emit('joinAuction', { auctionId }, () => {
      // Then leave
      clientIo.emit('leaveAuction', (response: AuctionLeaveResponse) => {
        try {
          expect(response.status).toBe('ok');
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });

  it('should no longer receive updates after leaving', (done) => {
    const auctionId = 1;
    let receiveCount = 0;

    clientIo.on('receiveBidOnAction', () => {
      receiveCount++;
    });

    clientIo.emit('joinAuction', { auctionId }, () => {
      clientIo.emit('leaveAuction', () => {
        clientIo.emit(
          'bidOnAction',
          auctionId,
          200,
          (response: BidCreationResponse) => {
            expect(response.status).toBe('ok');

            setTimeout(() => {
              try {
                expect(receiveCount).toBe(0);
                done();
              } catch (error) {
                done(error);
              }
            }, 100);
          },
        );
      });
    });
  });
});
