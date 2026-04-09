import type { Auction } from '@auction-platform/shared/domain';
import { useNavigate } from 'react-router-dom';

interface AuctionsListViewProps {
  auctions: Auction[];
  clickable?: boolean;
}

function formatCentsToEth(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatEndTime(endTimeUtc: Date): string {
  const end = new Date(endTimeUtc);
  return end.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
}

export default function AuctionsListView({ auctions, clickable = true }: AuctionsListViewProps) {
  const navigate = useNavigate();

  return (
    <div className="auction-grid">
      {auctions.map((auction) => (
        <div
          key={auction.auctionId}
          className={`auction-card card${clickable ? ' auction-card--clickable' : ''}`}
          onClick={clickable ? () => navigate(`/auction/${auction.auctionId}`) : undefined}
        >
          <h3 className="title auction-card__title">{auction.title}</h3>
          <p className="body auction-card__description">{auction.description}</p>

          <div className="auction-card__meta">
            <div className="auction-card__meta-item">
              <span className="label">Current Price</span>
              <span className="auction-card__price">
                ${formatCentsToEth(auction.startingPriceCents)}
              </span>
            </div>
            <div className="auction-card__meta-item">
              <span className="label">Ends</span>
              <span className="auction-card__date">
                {formatEndTime(auction.endTimeUtc)}
              </span>
              {clickable && <span className="auction-card__arrow">&rarr;</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
