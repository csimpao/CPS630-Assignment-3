import type { AuctionCreateParams } from '@auction-platform/shared/domain';
import { getMockApp, type HttpServer, testAuthToken } from '../../../__fixtures__/app.mock';
import type { Express } from 'express';
import request from 'supertest';

const endDate = new Date(Date.now() + 7 * 60 * 60 * 1000);
const params: AuctionCreateParams = {
  description: 'test desc',
  endTimeUtc: endDate,
  startingPriceCents: 1000,
  title: 'test title',
};

describe('createAuction', () => {
  describe('default app mock', () => {
    let app: Express;
    let httpServer: HttpServer;

    beforeEach(async () => {
      const mockApp = await getMockApp(false);
      app = mockApp.app;
      httpServer = mockApp.httpServer;
    });

    it('should validate the incoming data', async () => {
      const response = await request(app).post('/auctions').set('Authorization', `Bearer ${testAuthToken}`);
      const body = response.body;
      expect(body.status).toBe('fail');
      expect(response.statusCode).toBe(400);
    });

    it('should return the created auction', async () => {
      const response = await request(app).post('/auctions').set('Authorization', `Bearer ${testAuthToken}`).send(params);
      const body = response.body;

      expect(body).toEqual({
        active: true,
        auctionId: 1,
        bids: [],
        description: 'test desc',
        startingPriceCents: 1000,
        title: 'test title',
        endTimeUtc: endDate.toISOString(),
        startTimeUtc: expect.any(String),
      });
    });
  });

  it('should gracefully handle service failures', async () => {
    const mockApp = await getMockApp(false, {
      queueService: { value: true } as any,
    }); // throw error during test
    const app: Express = mockApp.app;

    const response = await request(app).post('/auctions').set('Authorization', `Bearer ${testAuthToken}`).send(params);
    const body = response.body;
    expect(response.statusCode).toBe(500);
    expect(body.status).toBe('error');
  });
});
