import { useEffect, useState } from 'react';
import type { AuctionWithBids } from '@auction-platform/shared/domain';
import { useApi } from '../providers/api';
import { useAuth } from '../providers/auth';
import Navbar from './dashboard/Navbar';
import AuctionSection from './dashboard/AuctionSection';

const REFRESH_INTERVAL_MS = 10000;

export default function DashboardPage() {
  const { api } = useApi();
  const { user, setUser } = useAuth();
  const [activeAuctions, setActiveAuctions] = useState<AuctionWithBids[]>([]);
  const [inactiveAuctions, setInactiveAuctions] = useState<AuctionWithBids[]>([]);
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);

  function fetchAll() {
    api.searchAuctions({ active: true }).then((auctions) => {
      setActiveAuctions(auctions);
      setLastFetchedAt(new Date());
    });
    api.searchAuctions({ active: false }).then(setInactiveAuctions);
    api.getUserInfo().then(setUser);
  }

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const participatedAuctions = [...(user?.participatedAuctions ?? [])].sort(
    (a, b) => Number(b.active) - Number(a.active),
  );

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
