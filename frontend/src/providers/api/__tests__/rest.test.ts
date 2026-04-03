import { createApi } from '../rest';
import { fetcher } from '../../../lib/fetcher';

vi.mock('../../../lib/fetcher', () => ({
  fetcher: vi.fn(),
}));

describe('RestApi', () => {
  const baseUrl = 'http://api.example.com';
  const api = createApi(baseUrl);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getUserInfo should call fetcher with correct params', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    vi.mocked(fetcher).mockResolvedValue(mockUser);

    const result = await api.getUserInfo();

    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/me`, { method: 'GET' });
    expect(result).toEqual(mockUser);
  });

  it('addToBalance should call fetcher with correct params', async () => {
    const mockUser = { id: 1, balanceCents: 1000 };
    vi.mocked(fetcher).mockResolvedValue(mockUser);

    const result = await api.addToBalance(500);

    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/me/balance`, {
      method: 'PATCH',
      body: JSON.stringify({ addedBalanceInCents: 500 }),
    });
    expect(result).toEqual(mockUser);
  });

  it('getAuction should call fetcher with correct params', async () => {
    const mockAuction = { auctionId: 1, title: 'Test' };
    vi.mocked(fetcher).mockResolvedValue(mockAuction);

    const result = await api.getAuction(1);

    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/auctions/1`, {
      method: 'GET',
    });
    expect(result).toEqual(mockAuction);
  });

  it('createAuction should call fetcher with correct params', async () => {
    const params = {
      title: 'New',
      description: 'Desc',
      startingPriceCents: 100,
      endTimeUtc: new Date(),
    };
    const mockAuction = { auctionId: 2, ...params };
    vi.mocked(fetcher).mockResolvedValue(mockAuction);

    const result = await api.createAuction(params as any);

    expect(fetcher).toHaveBeenCalledWith(`${baseUrl}/auctions`, {
      method: 'POST',
      body: JSON.stringify(params),
    });
    expect(result).toEqual(mockAuction);
  });

  it('searchAuctions should call fetcher with correct query params', async () => {
    vi.mocked(fetcher).mockResolvedValue([]);

    await api.searchAuctions({ query: 'test', active: true });

    const call = vi.mocked(fetcher).mock.calls[0];
    const url = call[0] as string;
    expect(url).toContain('query=test');
    expect(url).toContain('active=true');
    expect(call[1]).toEqual({ method: 'GET' });
  });
});
