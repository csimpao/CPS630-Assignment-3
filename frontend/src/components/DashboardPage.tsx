import { useEffect, useState } from 'react';
import type { AuctionWithBids } from '@auction-platform/shared/domain';
import { useApi } from '../providers/api';
import { useAuth } from '../providers/auth';
import Navbar from './dashboard/Navbar';
import AuctionSection from './dashboard/AuctionSection';

export default function DashboardPage() {
  const { api } = useApi();
  const { user } = useAuth();
  const [activeAuctions, setActiveAuctions] = useState<AuctionWithBids[]>([]);
  const [inactiveAuctions, setInactiveAuctions] = useState<AuctionWithBids[]>([]);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  useEffect(() => {
    api.searchAuctions({ active: true }).then((auctions) => {
      setActiveAuctions(auctions);
      setLastFetchedAt(new Date());
    });
    api.searchAuctions({ active: false }).then(setInactiveAuctions);
  }, []);

  const participatedAuctions = user?.participatedAuctions ?? [];

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard__content">
        <AuctionSection
          title="ACTIVE AUCTIONS"
          badgeLabel="LIVE NOW"
          badgeVariant="live"
          auctions={activeAuctions}
          emptyMessage="No active auctions"
          lastFetchedAt={lastFetchedAt}
        />

        <AuctionSection
          title="PARTICIPATED AUCTIONS"
          badgeLabel="YOUR HISTORY"
          badgeVariant="history"
          auctions={participatedAuctions}
          emptyMessage="No participated auctions"
        />

        <AuctionSection
          title="INACTIVE AUCTIONS"
          badgeLabel="CONCLUDED"
          badgeVariant="concluded"
          auctions={inactiveAuctions}
          emptyMessage="No inactive auctions"
          clickable={false}
        />
      </main>
    </div>
  );
}
