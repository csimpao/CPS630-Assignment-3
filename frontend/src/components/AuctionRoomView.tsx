import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../providers/api';
import { useAuth } from '../providers/auth';

function formatCentsToEth(cents: number): string {
  return Math.round(cents / 100).toLocaleString('en-US');
}

function formatDateTime(date: Date): string {
  const d = new Date(date);
  const datePart = d
    .toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })
    .toUpperCase();
  const timePart = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart}, ${timePart}`;
}

export default function AuctionRoomView() {
  const { auctionId } = useParams<{ auctionId: string }>();
  const navigate = useNavigate();
  const { api, currentAuction, relevantBids } = useApi();
  const { setUser } = useAuth();

  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);

  const numericAuctionId = Number(auctionId);

  useEffect(() => {
    if (!auctionId || isNaN(numericAuctionId)) return;

    setIsJoining(true);
    api.joinAuction(numericAuctionId).finally(() => setIsJoining(false));

    return () => {
      api.leaveAuction();
    };
  }, [numericAuctionId]);

  const currentPrice =
    relevantBids.length > 0
      ? relevantBids[relevantBids.length - 1].bidInCents
      : currentAuction?.startingPriceCents ?? 0;
  const minimumBidCents = currentPrice + 1;
  const minimumBidAmount = formatCentsToEth(minimumBidCents);
  const suggestedBidAmount = formatCentsToEth(currentPrice + 100);

  const handleBidInputBlur = () => {
    if (bidAmount === '') return;

    if (bidAmount.includes('.')) {
      setBidAmount('');
      setError('Bid must be a whole dollar amount with no decimals.');
      return;
    }

    const parsedBid = parseInt(bidAmount, 10);
    if (isNaN(parsedBid)) {
      setBidAmount('');
      return;
    }

    const minimumBid = Math.ceil(minimumBidCents / 100);
    if (parsedBid < minimumBid) {
      setBidAmount('');
    }
  };

  const handleBid = async () => {
    setError(null);

    if (bidAmount.includes('.')) {
      setError('Bid must be a whole dollar amount with no decimals.');
      return;
    }

    const bidInCents = parseInt(bidAmount, 10) * 100;
    if (isNaN(bidInCents) || bidInCents < minimumBidCents) {
      setError('Bid must be $1 more than the Current Price.');
      return;
    }
    try {
      await api.bidOnAuction(numericAuctionId, bidInCents);
      setBidAmount('');
      const updatedUser = await api.getUserInfo();
      setUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid');
    }
  };

  if (isJoining) {
    return (
      <div className="auction-room">
        <p className="body">Loading auction...</p>
      </div>
    );
  }

  if (!currentAuction) {
    return (
      <div className="auction-room">
        <button className="auction-room__back" onClick={() => navigate('/')}>
          &larr; Back
        </button>
        <p className="body">Auction not found.</p>
      </div>
    );
  }

  return (
    <div className="auction-room">
      <button className="auction-room__back" onClick={() => navigate('/')}>
        &larr; Back
      </button>

      <div className="auction-room__header">
        <h1 className="display-md">{currentAuction.title}</h1>
        <p className="body">{currentAuction.description}</p>
      </div>

      <div className="auction-room__details">
        <div className="auction-room__detail-item">
          <span className="label">Current Price</span>
          <span className="auction-room__price">
            ${formatCentsToEth(currentPrice)}
          </span>
        </div>
        <div className="auction-room__detail-item">
          <span className="label">Starting Price</span>
          <span className="auction-room__price auction-room__price--dim">
            ${formatCentsToEth(currentAuction.startingPriceCents)}
          </span>
        </div>
        <div className="auction-room__detail-item">
          <span className="label">Ends</span>
          <span className="auction-room__date">
            {formatDateTime(currentAuction.endTimeUtc)}
          </span>
        </div>
      </div>

      {currentAuction.active && (
        <div className="auction-room__bid-section">
          <div className="auction-room__bid-row">
            <input
              className="input-field auction-room__bid-input"
              type="number"
              step="1"
              min={minimumBidAmount}
              placeholder={`Minimum Bid: $${suggestedBidAmount}`}
              value={bidAmount}
              onBlur={handleBidInputBlur}
              onChange={(e) => setBidAmount(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBid()}
            />
            <button
              className="btn btn-primary auction-room__bid-btn"
              type="button"
              onClick={handleBid}
            >
              PLACE BID
            </button>
          </div>
          {error && <p className="auction-room__error">{error}</p>}
        </div>
      )}

      <div className="auction-room__bids">
        <h2 className="title">Bid History</h2>
        {relevantBids.length === 0 ? (
          <p className="body">No bids yet.</p>
        ) : (
          <ul className="auction-room__bid-list">
            {[...relevantBids].reverse().map((bid) => (
              <li key={bid.bidId} className="auction-room__bid-item">
                <span className="auction-room__bid-amount">
                  ${formatCentsToEth(bid.bidInCents)}
                </span>
                <span className="body auction-room__bid-user">
                  {bid.userName ?? `User #${bid.userId}`}
                </span>
                <span className="body auction-room__bid-time">
                  {formatDateTime(bid.bidTimeUtc)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
