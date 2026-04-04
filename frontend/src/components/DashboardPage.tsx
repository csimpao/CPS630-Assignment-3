import type { Auction } from '@auction-platform/shared/domain';
import Navbar from './dashboard/Navbar';
import AuctionSection from './dashboard/AuctionSection';

// Empty arrays for now — will be wired to API later
const activeAuctions: Auction[] = [];
const participatedAuctions: Auction[] = [];
const inactiveAuctions: Auction[] = [];

export default function DashboardPage() {
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
        />
      </main>
    </div>
  );
}
