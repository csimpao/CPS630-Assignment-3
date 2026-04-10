import type { Auction, AuctionWithBids } from '@auction-platform/shared/domain';
import { useNavigate } from 'react-router-dom';

interface AuctionsListViewProps {
  auctions: (Auction | AuctionWithBids)[];
  clickable?: boolean;
}

function getCurrentPrice(auction: Auction | AuctionWithBids): number {
  if ('bids' in auction && auction.bids.length > 0) {
    return auction.bids[auction.bids.length - 1].bidInCents;
  }
  return auction.startingPriceCents;
}

function formatCentsToEth(cents: number): string {
  return Math.round(cents / 100).toLocaleString('en-US');
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
          className={`auction-card card${!auction.active ? ' auction-card--inactive' : clickable ? ' auction-card--clickable' : ''}`}
          onClick={clickable && auction.active ? () => navigate(`/auction/${auction.auctionId}`) : undefined}
        >
          <h3 className="title auction-card__title">{auction.title}</h3>
          <p className="body auction-card__description">{auction.description}</p>

          <div className="auction-card__meta">
            <div className="auction-card__meta-item">
              <span className="label">{auction.active ? 'Current Price' : 'Sold Price'}</span>
              <span className="auction-card__price">
                ${formatCentsToEth(getCurrentPrice(auction))}
              </span>
            </div>
            <div className="auction-card__meta-item">
              <span className="label">{auction.active ? 'Ends' : 'Ended'}</span>
              <span className="auction-card__date">
                {formatEndTime(auction.endTimeUtc)}
              </span>
              {clickable && auction.active && <span className="auction-card__arrow">&rarr;</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
