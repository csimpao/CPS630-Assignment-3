import type {
  Auction,
  AuctionWithBids,
  Bid,
  BidCreationParams,
} from '@auction-platform/shared';
import { useState } from 'react';
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

  socket.on('receiveBidOnAction', (bid: Bid) => {
    if (bid.auctionId === currentAuctionId) {
      setRelevantBids((oldRelevantBids) => [...oldRelevantBids, bid]);
    }
    // TODO: do we need to change the room if this is not the case?
  });

  socket.on('endAuction', (auctionWithBids: AuctionWithBids) => {
    setCurrentAuction(auctionWithBids);
    setRelevantBids(auctionWithBids.bids);
  });

  // test
  socket.on('test', (message) => {
    console.log('received message', message);
  });

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

            setRelevantBids((oldRelevantBids) => [
              ...oldRelevantBids,
              response.payload,
            ]);
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
