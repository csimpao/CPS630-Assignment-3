import { useState } from 'react';
import FilterAuction from '../FilterAuction';

export default function SearchAuctions() {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <div className="navbar__search">
      <svg
        className="navbar__search-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="input-field navbar__search-input"
        type="text"
        onClick={() => setIsClicked(true)}
        placeholder="FILTER AUCTIONS..."
      />
      <FilterAuction isClicked={isClicked} onClose={() => setIsClicked(false)}/>
    </div>
  );
}
