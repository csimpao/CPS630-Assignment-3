import { useState } from 'react';
import CreateAuction from '../CreateAuction';

export default function NewAuctionButton() {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <>
      <button className="btn btn-outlined" type="button" onClick={() => setIsClicked(true)}>
        CREATE AUCTION
      </button>
      <CreateAuction isClicked={isClicked} onClose={() => setIsClicked(false)}/>
    </>
  );
}
