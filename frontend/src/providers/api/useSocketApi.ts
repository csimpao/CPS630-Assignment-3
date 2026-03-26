import type { Auction, Bid, BidCreationParams } from '@auction-platform/shared';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import type { ApiProvider } from '../../types/api';

const ErrTimeout = new Error('Server did not respond in time');

export interface UseSocketApiReturn {
  isSocketConnected: ApiProvider['isSocketConnected'];
  currentAuctionId: ApiProvider['currentAuctionId'];
  relevantBids: ApiProvider['relevantBids'];
  currentAuction: ApiProvider['currentAuction'];
  socketApi: SocketApi;
}

export const useSocketApi = (socket: Socket): UseSocketApiReturn => {
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

  socket.on('receiveBidOnAuction', (bid: Bid) => {
    if (bid.auctionId === currentAuctionId) {
      setRelevantBids((oldRelevantBids) => [...oldRelevantBids, bid]);
    }
    // TODO: do we need to change the room if this is not the case?
  });

  socket.on('endAuction', (auction: Auction, bids: Bid[]) => {
    setCurrentAuction(auction);
    setRelevantBids(bids);
  });

  return {
    isSocketConnected,
    currentAuctionId,
    relevantBids,
    currentAuction,
    socketApi: {
      bidOnAuction: (params: BidCreationParams) =>
        new Promise<void>((resolve, reject) => {
          socket
            .timeout(5000)
            .emit('bidOnAuction', params, (err: any, response: any) => {
              // TODO: figure out how to type this
              if (err) {
                return reject(ErrTimeout);
              }

              if (response && response.error) {
                return reject(new Error(response.message));
              }

              // TODO: check the ordering on this and the type
              setRelevantBids((oldRelevantBids) => [
                ...oldRelevantBids,
                response.message,
              ]);
              resolve();
            });
        }),
      joinAuction: (auctionId: Auction['auctionId']) =>
        new Promise<void>((resolve, reject) => {
          socket
            .timeout(5000)
            .emit('joinAuction', auctionId, (err: any, response: any) => {
              // TODO: figure out how to type this
              if (err) {
                return reject(ErrTimeout);
              }

              if (response && response.error) {
                return reject(new Error(response.message));
              }

              setRelevantBids(response.message.bids);
              setCurrentAuction(response.message.auction);
              setCurrentAuctionId(response.message.auction.auctionId);
              resolve();
            });
        }),
      leaveAuction: () =>
        new Promise<void>((resolve, reject) => {
          socket
            .timeout(5000)
            .emit('leaveAuction', (err: any, response: any) => {
              // TODO: figure out how to type this
              if (err) {
                return reject(ErrTimeout);
              }

              if (response && response.error) {
                return reject(new Error(response.message));
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
