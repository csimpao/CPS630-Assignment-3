interface AuctionItemProps {
  title: string;
  description: string;
  currentPriceCents: number;
  endTimeUtc: Date;
}

function formatCentsToEth(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatEndTime(endTimeUtc: Date): string {
  const end = new Date(endTimeUtc);
  const date = end.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
  const time = end.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${date}, ${time}`;
}

export default function AuctionItem({
  title,
  description,
  currentPriceCents,
  endTimeUtc,
}: AuctionItemProps) {
  return (
    <div className="auction-card card">
      <h3 className="title auction-card__title">{title}</h3>
      <p className="body auction-card__description">{description}</p>

      <div className="auction-card__meta">
        <div className="auction-card__meta-item">
          <span className="label">Current Price</span>
          <span className="auction-card__price">
            {formatCentsToEth(currentPriceCents)} ETH
          </span>
        </div>
        <div className="auction-card__meta-item">
          <span className="label">Ends In</span>
          <span className="auction-card__date">
            {formatEndTime(endTimeUtc)}
          </span>
        </div>
      </div>

      <div className="auction-card__bid-row">
        <input
          className="input-field auction-card__bid-input"
          type="number"
          step="0.01"
          placeholder={formatCentsToEth(currentPriceCents + 1)}
          readOnly
        />
        <button className="btn btn-primary auction-card__bid-btn" type="button">
          SUBMIT BID
        </button>
      </div>
    </div>
  );
}
