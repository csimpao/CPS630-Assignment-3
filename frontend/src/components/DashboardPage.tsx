import { useEffect, useState } from 'react';
import type { Auction } from '@auction-platform/shared/domain';
import { useApi } from '../providers/api';
import { useAuth } from '../providers/auth';
import Navbar from './dashboard/Navbar';
import AuctionSection from './dashboard/AuctionSection';

export default function DashboardPage() {
  const { api } = useApi();
  const { user } = useAuth();
  const [activeAuctions, setActiveAuctions] = useState<Auction[]>([]);
  const [inactiveAuctions, setInactiveAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    api.searchAuctions({ active: true }).then(setActiveAuctions);
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
