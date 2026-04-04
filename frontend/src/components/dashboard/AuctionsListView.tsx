import type { Auction } from '@auction-platform/shared/domain';

interface AuctionsListViewProps {
  auctions: Auction[];
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

export default function AuctionsListView({ auctions }: AuctionsListViewProps) {
  return (
    <div className="auction-grid">
      {auctions.map((auction) => (
        <div key={auction.auctionId} className="auction-card card">
          <h3 className="title auction-card__title">{auction.title}</h3>
          <p className="body auction-card__description">{auction.description}</p>

          <div className="auction-card__meta">
            <div className="auction-card__meta-item">
              <span className="label">Current Price</span>
              <span className="auction-card__price">
                {formatCentsToEth(auction.startingPriceCents)} ETH
              </span>
            </div>
            <div className="auction-card__meta-item">
              <span className="label">Ends</span>
              <span className="auction-card__date">
                {formatEndTime(auction.endTimeUtc)}
              </span>
            </div>
          </div>

          <div className="auction-card__bid-row">
            <input
              className="input-field auction-card__bid-input"
              type="number"
              step="0.01"
              placeholder={formatCentsToEth(auction.startingPriceCents + 1)}
              readOnly
            />
            <button className="btn btn-primary auction-card__bid-btn" type="button">
              BID
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
