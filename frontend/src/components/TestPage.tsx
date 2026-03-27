import { useApi } from '../providers/api';

export default function TestPage() {
  const {
    // api,
    currentAuction,
    currentAuctionId,
    isSocketConnected,
    relevantBids,
  } = useApi();

  return (
    <>
      <p>currentAuction: {JSON.stringify(currentAuction)}</p>
      <p>currentAuctionId: {JSON.stringify(currentAuctionId)}</p>
      <p>isSocketConnected: {JSON.stringify(isSocketConnected)}</p>
      <p>relevantBids: {JSON.stringify(relevantBids)}</p>
    </>
  );
}
