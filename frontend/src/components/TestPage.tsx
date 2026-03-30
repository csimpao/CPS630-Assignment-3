import type { Auction } from '@auction-platform/shared';
import { useApi } from '../providers/api';
import { useState } from 'react';

export default function TestPage() {
  const {
    api,
    currentAuction,
    currentAuctionId,
    isSocketConnected,
    relevantBids,
  } = useApi();

  const [auctionId, setAuctionId] = useState<string>('');

  const onChangeAuction = async (auctionId: Auction['auctionId']) => {
    console.log('joined auction', auctionId);
    await api.joinAuction(auctionId);
  };

  console.log('rerendering');

  return (
    <>
      <p>currentAuctionId: {JSON.stringify(currentAuctionId)}</p>
      <p>isSocketConnected: {JSON.stringify(isSocketConnected)}</p>
      <p>relevantBids: {JSON.stringify(relevantBids)}</p>
      <div>
        <label htmlFor="auctionId">Change auction</label>
        <p>currentAuction: {JSON.stringify(currentAuction)}</p>
        <input
          type="text"
          name="auctionId"
          value={auctionId}
          onChange={(e) => setAuctionId(e.target.value)}
        />
        <button onClick={() => onChangeAuction(parseInt(auctionId))}>
          Update auctionId
        </button>
      </div>
    </>
  );
}
