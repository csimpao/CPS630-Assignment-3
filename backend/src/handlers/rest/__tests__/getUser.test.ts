import { getMockApp, type HttpServer } from '../../../__fixtures__/app.mock';
import type { Express } from 'express';
import request from 'supertest';
import { FakeUserService } from '../../../__fixtures__/userService.mock';

describe('getUser', () => {
  describe('default app mock', () => {
    let app: Express;
    let httpServer: HttpServer;

    beforeEach(() => {
      const userService = new FakeUserService();
      const mockApp = getMockApp({ userService });
      userService.createUser({});

      app = mockApp.app;
      httpServer = mockApp.httpServer;
    });

    it('should return the queried user', async () => {
      const response = await request(app).get('/me');
      const body = response.body;

      expect(body).toEqual({
        balanceInCents: 0,
        name: 'name',
        participatedAuctions: [],
        userId: 1,
      });
    });
  });

  it('should return a 404 when the user could not be found', async () => {
    const userService = new FakeUserService(); // do not add a user
    const mockApp = getMockApp({ userService }); // throw error during test
    const app: Express = mockApp.app;
    const response = await request(app).get('/me');
    const body = response.body;

    expect(response.statusCode).toBe(404);
    expect(body.status).toBe('error');
  });

  it('should gracefully handle service failures', async () => {
    const mockApp = getMockApp({ userService: { value: true } as any }); // throw error during test
    const app: Express = mockApp.app;

    const response = await request(app).get('/me');
    const body = response.body;
    expect(response.statusCode).toBe(500);
    expect(body.status).toBe('error');
  });
});
