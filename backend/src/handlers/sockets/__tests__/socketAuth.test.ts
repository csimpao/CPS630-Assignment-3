import { getMockApp, type HttpServer, testAuthToken } from '../../../__fixtures__/app.mock';
import { io as ClientIo } from 'socket.io-client';
import type { AddressInfo } from 'net';

describe('socket authentication', () => {
  let httpServer: HttpServer;
  let port: number;

  beforeEach(async () => {
    const mockApp = await getMockApp(false);
    httpServer = mockApp.httpServer;
    await new Promise<void>((resolve) => {
      httpServer.listen(() => {
        port = (httpServer.address() as AddressInfo).port;
        resolve();
      });
    });
  });

  afterEach(() => {
    httpServer.close();
  });

  it('should reject connection with no token', (done) => {
    const client = ClientIo(`http://localhost:${port}`, { reconnection: false });
    client.on('connect_error', (err) => {
      expect(err.message).toBe('Authentication required');
      client.disconnect();
      done();
    });
  });

  it('should accept connection with a valid token', (done) => {
    const client = ClientIo(`http://localhost:${port}`, {
      auth: { token: testAuthToken },
      reconnection: false,
    });
    client.on('connect', () => { client.disconnect(); done(); });
    client.on('connect_error', (err) => { client.disconnect(); done(err); });
  });
});
