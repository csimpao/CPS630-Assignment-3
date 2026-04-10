import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../providers/api';

interface FilterAuctionProps {
    isClicked: boolean;
    onClose: () => void;
}

export default function FilterAuction({ isClicked, onClose }: FilterAuctionProps) {
    const { api } = useApi();
    const navigate = useNavigate();
    const [query, setQuery] = useState<string | undefined>();
    const [activeChecked, setActiveChecked] = useState(false);
    const [inactiveChecked, setInactiveChecked] = useState(false);
    const [minPriceInCents, setMinPrice] = useState<number | undefined>();
    const [maxPriceInCents, setMaxPrice] = useState<number | undefined>();
    const [minPriceInCentsInput, setMinPriceInput] = useState("");
    const [maxPriceInCentsInput, setMaxPriceInput] = useState("");
    const [auctions, setAuctions] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [err, setErr] = useState("");

    if (!isClicked) return null;

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setErr("");

        const hasQuery = !!query?.trim();
        const hasMin = minPriceInCents !== undefined;
        const hasMax = maxPriceInCents !== undefined;

        if (!activeChecked && !inactiveChecked && !hasQuery && !hasMin && !hasMax) {
            setErr("Please fill in at least one filter field");
            return;
        }

        if (hasMin && hasMax && minPriceInCents! > maxPriceInCents!) {
            setErr("Min price cannot be greater than max price");
            return;
        }

        // Both checked = no active filter; one checked = filter by that status
        const active = (activeChecked && inactiveChecked)
            ? undefined
            : activeChecked ? true : false;

        setIsSubmitting(true);
        const queryParams = {
            query: query?.trim() || undefined,
            active,
            minPriceInCents,
            maxPriceInCents,
        };
        try {
            const auctionRes = await api.searchAuctions(queryParams);
            setAuctions(auctionRes);
            setHasSearched(true);
        } catch (err) {
            setErr("Failed to find your auctions");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleMinPrice(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setMinPriceInput(val);
        if (val === '') {
            setMinPrice(undefined);
        } else {
            const dollars = parseFloat(val) || 0;
            setMinPrice(Math.max(1, Math.round(dollars * 100)));
        }
    }

    function handleMaxPrice(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setMaxPriceInput(val);
        if (val === '') {
            setMaxPrice(undefined);
        } else {
            const dollars = parseFloat(val) || 0;
            setMaxPrice(Math.max(1, Math.round(dollars * 100)));
        }
    }

    function handleMinPriceBlur() {
        if (minPriceInCentsInput === "") return;
        const dollars = parseFloat(minPriceInCentsInput) || 0;
        const cents = Math.max(1, Math.round(dollars * 100));
        setMinPriceInput((cents / 100).toFixed(2));
        setMinPrice(cents);
    }

    function handleMaxPriceBlur() {
        if (maxPriceInCentsInput === "") return;
        const dollars = parseFloat(maxPriceInCentsInput) || 0;
        const cents = Math.max(1, Math.round(dollars * 100));
        setMaxPriceInput((cents / 100).toFixed(2));
        setMaxPrice(cents);
    }

    function handleCancel() {
        setQuery(undefined);
        setActiveChecked(false);
        setInactiveChecked(false);
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setMinPriceInput("");
        setMaxPriceInput("");
        setAuctions([]);
        setHasSearched(false);
        setErr("");
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
                    <h2 className="modal__title">FILTER AUCTION</h2>
                    <button className="modal__close" type="button" onClick={handleCancel}>
                        &times;
                    </button>
                </div>

                <label className="label">Please detail your auction</label>

                <input
                    type="text"
                    className="input-field"
                    placeholder="Item Name:"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <div className="modal__quick-add">
                    <label>
                        Active:
                        <input
                            type="checkbox"
                            checked={activeChecked}
                            onChange={() => setActiveChecked(!activeChecked)}
                            style={{ marginLeft: '0.5rem' }}
                        />
                    </label>
                    <label style={{ marginLeft: '1rem' }}>
                        Inactive:
                        <input
                            type="checkbox"
                            checked={inactiveChecked}
                            onChange={() => setInactiveChecked(!inactiveChecked)}
                            style={{ marginLeft: '0.5rem' }}
                        />
                    </label>
                </div>

                <input
                    type="text"
                    className="input-field"
                    placeholder="Min Price ($)"
                    value={minPriceInCentsInput}
                    onChange={handleMinPrice}
                    onBlur={handleMinPriceBlur}
                />

                <input
                    type="text"
                    className="input-field"
                    placeholder="Max Price ($)"
                    value={maxPriceInCentsInput}
                    onChange={handleMaxPrice}
                    onBlur={handleMaxPriceBlur}
                />

                {hasSearched && auctions.length === 0 && !err && (
                    <p className="label" style={{ marginTop: '0.5rem' }}>No auctions found</p>
                )}

                {auctions.length > 0 && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '0.5rem' }}>
                        <label className="label">{auctions.length} result{auctions.length !== 1 ? 's' : ''} found</label>
                        {auctions.map((auction) => {
                            const lastBid = auction.bids?.length > 0 ? auction.bids[auction.bids.length - 1] : undefined;
                            const currentPrice = lastBid ? lastBid.bidInCents : auction.startingPriceCents;
                            return (
                                <div
                                    key={auction.auctionId}
                                    className={`auction-card card${auction.active ? ' auction-card--clickable' : ''}`}
                                    style={{ marginBottom: '0.5rem', cursor: auction.active ? 'pointer' : 'default' }}
                                    onClick={auction.active ? () => navigate(`/auction/${auction.auctionId}`) : undefined}
                                >
                                    <h3 className="title auction-card__title">{auction.title}</h3>
                                    <div className="auction-card__meta">
                                        <div className="auction-card__meta-item">
                                            <span className="label">Price</span>
                                            <span className="auction-card__price">${(currentPrice / 100).toFixed(2)}</span>
                                        </div>
                                        <div className="auction-card__meta-item">
                                            <span className="label">Status</span>
                                            <span>{auction.active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {err && <p className="modal__error">{err}</p>}

                <button
                    className="btn btn-primary btn-full modal__confirm"
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSearch}
                >
                    {isSubmitting ? 'FINDING YOUR AUCTIONS...' : 'CONFIRM'}
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
