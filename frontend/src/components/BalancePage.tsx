import { useState } from 'react';
import { useAuth } from '../providers/auth';
import { useApi } from '../providers/api';

export default function BalancePage() {
  const { user } = useAuth();
  const { api } = useApi();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(user?.balanceInCents ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const dollars = parseFloat(amount);
    if (isNaN(dollars) || dollars <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    const cents = Math.round(dollars * 100);
    setLoading(true);
    try {
      const updatedUser = await api.addToBalance(cents);
      setBalance(updatedUser.balanceInCents);
      setAmount('');
      setSuccess(`Added $${dollars.toFixed(2)}. New balance: $${(updatedUser.balanceInCents / 100).toFixed(2)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add credits');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Add Credits</h2>
      <p>Current balance: <strong>${(balance / 100).toFixed(2)}</strong></p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount (USD)</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Credits'}
        </button>
      </form>
    </div>
  );
}
