import { getMockApp, type HttpServer } from '../../../__fixtures__/app.mock';
import type { Express } from 'express';
import request from 'supertest';
import type { AuctionService } from '../../../types/services';

describe('searchAuctions', () => {
  describe('default app mock', () => {
    let app: Express;
    let httpServer: HttpServer;
    let mockAuctionService: AuctionService;

    beforeEach(async () => {
      mockAuctionService = {
        createAuction: jest.fn(),
        getAuction: jest.fn(),
        placeBid: jest.fn(),
        processAuctionClosure: jest.fn(),
        searchAuctions: jest.fn().mockResolvedValue([]),
      };
      const mockApp = await getMockApp(false, {
        auctionService: mockAuctionService,
      });

      app = mockApp.app;
      httpServer = mockApp.httpServer;
    });

    it('should pass through the query params', async () => {
      const response = await request(app).get(
        '/auctions?active=true&query=hello&minPriceInCents=3000&maxPriceInCents=4000',
      );
      const body = response.body;
      expect(response.statusCode).toBe(200);
      expect(body).toEqual([]);
      expect(mockAuctionService.searchAuctions).toHaveBeenCalledWith({
        active: true,
        minPriceInCents: 3000,
        maxPriceInCents: 4000,
        query: 'hello',
      });
    });

    it('should validate the incoming data', async () => {
      const response = await request(app).get(
        '/auctions?active=34234&minPriceInCents=-1&maxPriceInCents=-1',
      );
      const body = response.body;
      expect(response.statusCode).toBe(400);
      expect(body.errors?.fieldErrors?.maxPriceInCents).toBeDefined();
      expect(body.errors?.fieldErrors?.minPriceInCents).toBeDefined();
      expect(body.errors?.fieldErrors?.active).toBeDefined();
    });
  });

  it('should gracefully handle service failures', async () => {
    const mockApp = await getMockApp(false, {
      auctionService: { value: true } as any,
    }); // throw error during test
    const app: Express = mockApp.app;

    const response = await request(app).get('/auctions');
    const body = response.body;
    expect(response.statusCode).toBe(500);
    expect(body.status).toBe('error');
  });
});
