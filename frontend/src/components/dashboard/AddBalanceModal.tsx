import { useState } from 'react';
import { NumericFormat } from 'react-number-format';

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ADD_OPTIONS = [5_000, 10_000, 25_000];

export default function AddBalanceModal({ isOpen, onClose }: AddBalanceModalProps) {
  const [amount, setAmount] = useState<number | undefined>(undefined);

  if (!isOpen) return null;

  function handleQuickAdd(value: number) {
    setAmount((prev) => (prev ?? 0) + value);
  }

  function handleConfirm() {
    // No functionality yet — just close
    setAmount(undefined);
    onClose();
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

        <button
          className="btn btn-primary btn-full modal__confirm"
          type="button"
          disabled={!amount}
          onClick={handleConfirm}
        >
          CONFIRM
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
