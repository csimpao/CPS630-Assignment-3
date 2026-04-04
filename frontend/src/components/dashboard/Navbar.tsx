import { useAuth } from '../../providers/auth';
import SearchAuctions from './SearchAuctions';
import AddBalanceButton from './AddBalanceButton';
import NewAuctionButton from './NewAuctionButton';

export default function Navbar() {
  const { user } = useAuth();
  const balanceInCents = user?.balanceInCents ?? 0;
  const formattedBalance = `$${(balanceInCents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <nav className="navbar">
      <SearchAuctions />

      <div className="navbar__actions">
        <div className="navbar__balance">
          <span className="label">Balance:</span>
          <span className="navbar__balance-amount">{formattedBalance}</span>
        </div>

        <AddBalanceButton />
        <NewAuctionButton />
      </div>
    </nav>
  );
}
