import { getMockApp, type HttpServer } from '../../../__fixtures__/app.mock';
import type { Express } from 'express';
import request from 'supertest';
import { FakeUserService } from '../../../__fixtures__/userService.mock';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const testToken = jwt.sign({ userId: 1 }, JWT_SECRET);

describe('getUser', () => {
  describe('default app mock', () => {
    let app: Express;
    let httpServer: HttpServer;

    beforeEach(async () => {
      const userService = new FakeUserService();
      const mockApp = await getMockApp(false, { userService });
      await userService.createUser({ name: 'Test User', email: 'test@test.com', password: 'password' });

      app = mockApp.app;
      httpServer = mockApp.httpServer;
    });

    it('should return the queried user', async () => {
      const response = await request(app).get('/me').set('Authorization', `Bearer ${testToken}`);
      const body = response.body;

      expect(body).toEqual({
        balanceInCents: 0,
        name: 'Test User',
        participatedAuctions: [],
        userId: 1,
      });
    });
  });

  it('should return a 404 when the user could not be found', async () => {
    const userService = new FakeUserService(); // do not add a user
    const mockApp = await getMockApp(false, { userService }); // throw error during test
    const app: Express = mockApp.app;
    const response = await request(app).get('/me').set('Authorization', `Bearer ${testToken}`);
    const body = response.body;

    expect(response.statusCode).toBe(404);
    expect(body.status).toBe('error');
  });

  it('should gracefully handle service failures', async () => {
    const mockApp = await getMockApp(false, {
      userService: { value: true } as any,
    }); // throw error during test
    const app: Express = mockApp.app;

    const response = await request(app).get('/me').set('Authorization', `Bearer ${testToken}`);
    const body = response.body;
    expect(response.statusCode).toBe(500);
    expect(body.status).toBe('error');
  });
});
