import type {
  Auction,
  AuctionWithBids,
  Bid,
  BidCreationParams,
} from '@auction-platform/shared';
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import type { ApiProvider } from '../../types/api';
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from '../../../../shared/dist/socket';

const ErrTimeout = new Error('Server did not respond in time');

export interface UseSocketApiReturn {
  isSocketConnected: ApiProvider['isSocketConnected'];
  currentAuctionId: ApiProvider['currentAuctionId'];
  relevantBids: ApiProvider['relevantBids'];
  currentAuction: ApiProvider['currentAuction'];
  socketApi: SocketApi;
}

export const useSocketApi = (
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
): UseSocketApiReturn => {
  // TODO: implement isConnected functionality
  const [isSocketConnected, _setIsSocketConnected] =
    useState<ApiProvider['isSocketConnected']>(false);
  const [currentAuctionId, setCurrentAuctionId] =
    useState<ApiProvider['currentAuctionId']>(null);
  const [currentAuction, setCurrentAuction] =
    useState<ApiProvider['currentAuction']>(null);
  const [relevantBids, setRelevantBids] = useState<ApiProvider['relevantBids']>(
    [],
  );

  useEffect(() => {
    const handleReceiveBid = (bid: Bid) => {
      if (bid.auctionId === currentAuctionId) {
        setRelevantBids((old) => [...old, bid]);
      }
    };

    const handleEndAuction = (auctionWithBids: AuctionWithBids) => {
      setCurrentAuction(auctionWithBids);
      setRelevantBids(auctionWithBids.bids);
    };

    socket.on('receiveBidOnAction', handleReceiveBid);
    socket.on('endAuction', handleEndAuction);

    return () => {
      socket.off('receiveBidOnAction', handleReceiveBid);
      socket.off('endAuction', handleEndAuction);
    };
  }, [socket, currentAuctionId]);

  return {
    isSocketConnected,
    currentAuctionId,
    relevantBids,
    currentAuction,
    socketApi: {
      bidOnAuction: (params: BidCreationParams) =>
        new Promise<void>((resolve, reject) => {
          socket.timeout(5000).emit('bidOnAction', params, (err, response) => {
            if (err) {
              return reject(ErrTimeout);
            }

            if (response.status == 'error') {
              return reject(new Error(response.error));
            }

            resolve();
          });
        }),
      joinAuction: (auctionId: Auction['auctionId']) =>
        new Promise<void>((resolve, reject) => {
          socket
            .timeout(5000)
            .emit('joinAuction', { auctionId }, (err, response) => {
              if (err) {
                return reject(ErrTimeout);
              }

              if (response.status === 'error') {
                return reject(new Error(response.error));
              }

              const { bids, ...auction } = response.payload;
              setRelevantBids(bids);
              setCurrentAuction(auction);
              setCurrentAuctionId(response.payload.auctionId);
              resolve();
            });
        }),
      leaveAuction: () =>
        new Promise<void>((resolve, reject) => {
          socket.timeout(5000).emit('leaveAuction', (err, response) => {
            if (err) {
              return reject(ErrTimeout);
            }

            if (response.status === 'error') {
              return reject(new Error(response.error));
            }

            setRelevantBids([]);
            setCurrentAuction(null);
            setCurrentAuctionId(null);
            resolve();
          });
        }),
    },
  };
};

export type SocketApi = {
  bidOnAuction: (bidCreationParams: BidCreationParams) => Promise<void>;
  joinAuction: (auctionId: Auction['auctionId']) => Promise<void>;
  leaveAuction: () => Promise<void>;
};
