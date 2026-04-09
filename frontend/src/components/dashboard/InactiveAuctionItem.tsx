interface InactiveAuctionItemProps {
  title: string;
  description: string;
  soldPriceCents: number;
  endedDate: Date;
}

function formatCentsToEth(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatEndedDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
}

export default function InactiveAuctionItem({
  title,
  description,
  soldPriceCents,
  endedDate,
}: InactiveAuctionItemProps) {
  return (
    <div className="auction-card card auction-card--inactive">
      <h3 className="title auction-card__title">{title}</h3>
      <p className="body auction-card__description">{description}</p>

      <div className="auction-card__meta">
        <div className="auction-card__meta-item">
          <span className="label">Sold Price</span>
          <span className="auction-card__price">
            ${formatCentsToEth(soldPriceCents)}
          </span>
        </div>
        <div className="auction-card__meta-item">
          <span className="label">Ended</span>
          <span className="auction-card__date">
            {formatEndedDate(endedDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
