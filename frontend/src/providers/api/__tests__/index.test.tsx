import { render, screen, renderHook } from '@testing-library/react';
import ApiContextProvider, { useApi } from '../index';

describe('ApiContextProvider', () => {
  const mockRestApi: any = {
    getUserInfo: vi.fn(),
    addToBalance: vi.fn(),
  };

  const mockSocketApiReturn: any = {
    relevantBids: [],
    currentAuctionId: 123,
    currentAuction: { auctionId: 123, title: 'Test' },
    socketApi: {
      bidOnAuction: vi.fn(),
      joinAuction: vi.fn(),
      leaveAuction: vi.fn(),
    },
  };

  it('should provide context to children', () => {
    const TestComponent = () => {
      const { currentAuctionId } = useApi();
      return <div data-testid="auction-id">{currentAuctionId}</div>;
    };

    render(
      <ApiContextProvider restApi={mockRestApi} socketApi={mockSocketApiReturn}>
        <TestComponent />
      </ApiContextProvider>,
    );

    expect(screen.getByTestId('auction-id').textContent).toBe('123');
  });

  it('should throw error when used outside of provider', () => {
    expect(() => renderHook(() => useApi())).toThrow(
      'useApi must be used within an ApiProvider',
    );
  });

  it('should merge restApi and socketApi functions into api object', () => {
    let capturedApi: any;
    const TestComponent = () => {
      const { api } = useApi();
      capturedApi = api;
      return null;
    };

    render(
      <ApiContextProvider restApi={mockRestApi} socketApi={mockSocketApiReturn}>
        <TestComponent />
      </ApiContextProvider>,
    );

    expect(capturedApi.getUserInfo).toBe(mockRestApi.getUserInfo);
    expect(capturedApi.bidOnAuction).toBe(
      mockSocketApiReturn.socketApi.bidOnAuction,
    );
  });
});
