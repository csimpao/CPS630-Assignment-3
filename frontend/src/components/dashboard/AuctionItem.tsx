interface AuctionItemProps {
  title: string;
  description: string;
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

export default function AuctionItem({
  title,
  description,
  currentPriceCents,
  endTimeUtc,
  onClick,
}: AuctionItemProps) {
  return (
    <div className="auction-card auction-card--clickable card" onClick={onClick}>
      <h3 className="title auction-card__title">{title}</h3>
      <p className="body auction-card__description">{description}</p>

      <div className="auction-card__meta">
        <div className="auction-card__meta-item">
          <span className="label">Current Price</span>
          <span className="auction-card__price">
            ${formatCentsToEth(currentPriceCents)}
          </span>
        </div>
        <div className="auction-card__meta-item">
          <span className="label">Ends In</span>
          <span className="auction-card__date">
            {formatEndTime(endTimeUtc)}
          </span>
          <span className="auction-card__arrow">&rarr;</span>
        </div>
      </div>
    </div>
  );
}
