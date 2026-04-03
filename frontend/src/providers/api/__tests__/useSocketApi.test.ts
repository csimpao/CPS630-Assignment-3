// @ts-nocheck
// not worth the headache of typing properly for this implementation

import { renderHook, act } from '@testing-library/react';
import { useSocketApi } from '../useSocketApi';

const mockSocket = () => {
  const listeners: Record<string, Function[]> = {};
  const socket = {
    on: vi.fn((event, cb) => {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    }),
    off: vi.fn((event, cb) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(
          (listener) => listener !== cb,
        );
      }
    }),
    emit: vi.fn(),
    timeout: vi.fn(() => socket),
    // push updates to all listeners with observer pattern
    _publish: (event: string, ...args: any[]) => {
      listeners[event]?.forEach((cb) => cb(...args));
    },
  };
  return socket;
};

describe('useSocketApi', () => {
  let socket: any;

  beforeEach(() => {
    socket = mockSocket();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useSocketApi(socket));
    expect(result.current.isSocketConnected).toBe(false);
    expect(result.current.currentAuctionId).toBe(null);
    expect(result.current.relevantBids).toEqual([]);
    expect(result.current.currentAuction).toBe(null);
  });

  it('should update relevantBids when receiveBidOnAction is triggered', () => {
    const { result } = renderHook(() => useSocketApi(socket));

    socket.emit.mockImplementationOnce((event, data, cb) => {
      cb(null, { status: 'ok', payload: { auctionId: 1, bids: [] } });
    });

    act(() => {
      result.current.socketApi.joinAuction(1);
    });

    const mockBid = { auctionId: 1, bidId: 101, bidInCents: 200 };
    act(() => {
      socket._publish('receiveBidOnAction', mockBid);
    });

    expect(result.current.relevantBids).toContainEqual(mockBid);
  });

  it('should handle joinAuction', async () => {
    const { result } = renderHook(() => useSocketApi(socket));
    const mockAuction = { auctionId: 1, title: 'Test', bids: [{ bidId: 1 }] };

    socket.emit.mockImplementationOnce((event, data, cb) => {
      cb(null, { status: 'ok', payload: mockAuction });
    });

    await act(async () => {
      await result.current.socketApi.joinAuction(1);
    });

    expect(socket.emit).toHaveBeenCalledWith(
      'joinAuction',
      { auctionId: 1 },
      expect.any(Function),
    );
    expect(result.current.currentAuctionId).toBe(1);
    expect(result.current.relevantBids).toEqual(mockAuction.bids);
  });

  it('should handle leaveAuction', async () => {
    const { result } = renderHook(() => useSocketApi(socket));

    socket.emit.mockImplementationOnce((event, cb) => {
      cb(null, { status: 'ok' });
    });

    await act(async () => {
      await result.current.socketApi.leaveAuction();
    });

    expect(socket.emit).toHaveBeenCalledWith(
      'leaveAuction',
      expect.any(Function),
    );
    expect(result.current.currentAuctionId).toBe(null);
    expect(result.current.relevantBids).toEqual([]);
    expect(result.current.currentAuction).toBe(null);
  });

  it('should handle bidOnAuction', async () => {
    const { result } = renderHook(() => useSocketApi(socket));

    socket.emit.mockImplementationOnce((event, id, bid, cb) => {
      cb(null, { status: 'ok' });
    });

    await act(async () => {
      await result.current.socketApi.bidOnAuction(1, 200);
    });

    expect(socket.emit).toHaveBeenCalledWith(
      'bidOnAction',
      1,
      200,
      expect.any(Function),
    );
  });

  it('should reject if socket returns error', async () => {
    const { result } = renderHook(() => useSocketApi(socket));

    socket.emit.mockImplementationOnce((event, id, bid, cb) => {
      cb(null, { status: 'error', error: 'Too low' });
    });

    await expect(result.current.socketApi.bidOnAuction(1, 50)).rejects.toThrow(
      'Too low',
    );
  });
});
