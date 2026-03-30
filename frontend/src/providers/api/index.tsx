import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { ApiProvider } from '../../types/api';
import type { Bid } from '@auction-platform/shared';
import type { RestApi } from './rest';
import type { UseSocketApiReturn } from './useSocketApi';

const ApiContext = createContext<ApiProvider | null>(null);

interface ApiContextProvider extends PropsWithChildren {
  restApi: RestApi;
  socketApi: UseSocketApiReturn;
}
export default function ApiContextProvider({
  children,
  restApi,
  socketApi,
}: ApiContextProvider) {
  const relevantBids: Bid[] = [];
  const currentAuctionId = socketApi.currentAuctionId;
  const currentAuction = socketApi.currentAuction;
  const isSocketConnected = false;

  const values = useMemo<ApiProvider>(
    () => ({
      api: {
        ...restApi,
        ...socketApi.socketApi,
      },
      relevantBids,
      currentAuctionId,
      currentAuction,
      isSocketConnected,
    }),
    [
      restApi,
      socketApi,
      relevantBids,
      currentAuctionId,
      currentAuction,
      isSocketConnected,
    ],
  );
  return <ApiContext value={values}>{children}</ApiContext>;
}

export function useApi() {
  const context = useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
