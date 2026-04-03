import { getMockApp, type HttpServer, testAuthToken } from '../../../__fixtures__/app.mock';
import type { Express } from 'express';
import request from 'supertest';
import { FakeUserService } from '../../../__fixtures__/userService.mock';

const validUser = { name: 'Alice', email: 'alice@example.com', password: 'password123' };

describe('auth', () => {
  let app: Express;
  let httpServer: HttpServer;
  let userService: FakeUserService;

  beforeEach(async () => {
    userService = new FakeUserService();
    const mockApp = await getMockApp(false, { userService });
    app = mockApp.app;
    httpServer = mockApp.httpServer;
  });

  it('POST /auth/signup should return 201 with token and user', async () => {
    const response = await request(app).post('/auth/signup').send(validUser);
    expect(response.statusCode).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toMatchObject({ name: 'Alice', userId: 1 });
  });

  it('POST /auth/signup should return 400 on invalid input', async () => {
    const response = await request(app).post('/auth/signup').send({ email: 'bad' });
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe('fail');
  });

  it('POST /auth/login should return 200 with token on valid credentials', async () => {
    await request(app).post('/auth/signup').send(validUser);
    const response = await request(app).post('/auth/login').send({
      email: validUser.email,
      password: validUser.password,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBeDefined();
  });

  it('POST /auth/login should return 401 on wrong password', async () => {
    await request(app).post('/auth/signup').send(validUser);
    const response = await request(app).post('/auth/login').send({
      email: validUser.email,
      password: 'wrongpassword',
    });
    expect(response.statusCode).toBe(401);
  });

  it('requireAuth should return 401 with no token', async () => {
    const response = await request(app).get('/me');
    expect(response.statusCode).toBe(401);
  });

  it('requireAuth should return 401 with invalid token', async () => {
    const response = await request(app).get('/me').set('Authorization', 'Bearer bad-token');
    expect(response.statusCode).toBe(401);
  });

  it('requireAuth should allow access with valid token', async () => {
    await userService.createUser({ name: 'Test User', email: 'test@test.com', password: 'password' });
    const response = await request(app).get('/me').set('Authorization', `Bearer ${testAuthToken}`);
    expect(response.statusCode).toBe(200);
  });
});
