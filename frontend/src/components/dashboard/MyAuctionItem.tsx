interface MyAuctionItemProps {
  title: string;
  description: string;
  previousBidCents: number;
  currentPriceCents: number;
  endTimeUtc: Date;
  onClick?: () => void;
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

export default function MyAuctionItem({
  title,
  description,
  previousBidCents,
  currentPriceCents,
  endTimeUtc,
  onClick,
}: MyAuctionItemProps) {
  return (
    <div className="auction-card auction-card--clickable card" onClick={onClick}>
      <h3 className="title auction-card__title">{title}</h3>
      <p className="body auction-card__description">{description}</p>

      <div className="auction-card__meta">
        <div className="auction-card__meta-item">
          <span className="label">Your Previous Bid</span>
          <span className="auction-card__price">
            ${formatCentsToEth(previousBidCents)}
          </span>
        </div>
        <div className="auction-card__meta-item">
          <span className="label">Current Price</span>
          <span className="auction-card__price">
            ${formatCentsToEth(currentPriceCents)}
          </span>
        </div>
      </div>

      <div className="auction-card__meta">
        <div className="auction-card__meta-item">
          <span className="label">Ends</span>
          <span className="auction-card__date">
            {formatEndTime(endTimeUtc)}
          </span>
          <span className="auction-card__arrow">&rarr;</span>
        </div>
      </div>
    </div>
  );
}
