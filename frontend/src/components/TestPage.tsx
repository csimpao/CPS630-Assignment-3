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

  const onLeaveAuction = async () => {
    console.log('left auction');
    await api.leaveAuction();
  };

  console.log('rerendering');

  return (
    <>
      <p>currentAuctionId: {JSON.stringify(currentAuctionId)}</p>
      <p>isSocketConnected: {JSON.stringify(isSocketConnected)}</p>
      <p>relevantBids: {JSON.stringify(relevantBids)}</p>
      <div>
        <p>currentAuction: {JSON.stringify(currentAuction)}</p>
        <label htmlFor="auctionId">Change auction</label>
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

      <hr />

      <div>
        <label htmlFor="auctionId">Leave auction</label>
        <button onClick={() => onLeaveAuction()}>Leave auction</button>
      </div>
    </>
  );
}
