import { useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { useApi } from '../../providers/api';
import { useAuth } from '../../providers/auth';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ADD_OPTIONS = [50, 100, 250];

export default function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { api } = useApi();
  const { setUser } = useAuth();

  if (!isOpen) return null;

  function handleQuickAdd(value: number) {
    setAmount((prev) => (prev ?? 0) + value);
  }

  async function handleConfirm() {
    if (!amount) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const updatedUser = await api.addToBalance(Math.round(amount * 100));
      setUser(updatedUser);
      setAmount(undefined);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add balance');
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    setAmount(undefined);
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">ADD BALANCE</h2>
          <button className="modal__close" type="button" onClick={handleCancel}>
            &times;
          </button>
        </div>

        <label className="label">Amount to deposit</label>

        <NumericFormat
          className="input-field modal__amount-input"
          value={amount ?? ''}
          onValueChange={(values) => setAmount(values.floatValue)}
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale
          allowNegative={false}
          prefix="$ "
          placeholder="$ 0.00"
        />

        <div className="modal__quick-add">
          {QUICK_ADD_OPTIONS.map((value) => (
            <button
              key={value}
              className="btn btn-secondary modal__quick-btn"
              type="button"
              onClick={() => handleQuickAdd(value)}
            >
              +{value.toLocaleString()}
            </button>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}

        <button
          className="btn btn-primary btn-full modal__confirm"
          type="button"
          disabled={!amount || isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? 'ADDING...' : 'CONFIRM'}
        </button>

        <button
          className="btn btn-full modal__cancel"
          type="button"
          onClick={handleCancel}
        >
          CANCEL
        </button>
      </div>
    </div>
  );
}
