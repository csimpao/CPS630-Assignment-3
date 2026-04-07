import { useState } from 'react';
import AddBalanceModal from './AddBalanceModal';

export default function AddBalanceButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="btn btn-secondary" type="button" onClick={() => setIsOpen(true)}>
        ADD BALANCE
      </button>
      <AddBalanceModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
