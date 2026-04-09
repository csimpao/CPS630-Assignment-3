import type { Auction, AuctionWithBids } from '@auction-platform/shared/domain';
import StatusBadge from './StatusBadge';
import AuctionsListView from './AuctionsListView';
import EmptyState from './EmptyState';
import { useTimeAgo } from '../../lib/useTimeAgo';

interface AuctionSectionProps {
  title: string;
  badgeLabel: string;
  badgeVariant: 'live' | 'history' | 'concluded';
  auctions: (Auction | AuctionWithBids)[];
  emptyMessage: string;
  clickable?: boolean;
  lastFetchedAt?: Date | null;
}

export default function AuctionSection({
  title,
  badgeLabel,
  badgeVariant,
  auctions,
  emptyMessage,
  clickable = true,
  lastFetchedAt,
}: AuctionSectionProps) {
  const timeAgo = useTimeAgo(lastFetchedAt);

  return (
    <section className="auction-section">
      <div className="auction-section__header">
        <StatusBadge label={badgeLabel} variant={badgeVariant} />
        <h2 className="display-sm auction-section__title">{title}</h2>
        {timeAgo && <span className="auction-section__time-ago">{timeAgo}</span>}
      </div>

      {auctions.length > 0 ? (
        <AuctionsListView auctions={auctions} clickable={clickable} />
      ) : (
        <EmptyState message={emptyMessage} />
      )}
    </section>
  );
}
