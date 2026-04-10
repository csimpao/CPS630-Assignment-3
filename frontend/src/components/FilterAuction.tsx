import { useEffect, useState } from 'react';
import { useApi } from '../providers/api';

interface FilterAuctionProps {
    isClicked: boolean;
    onClose: () => void;
}

export default function FilterAuction({ isClicked, onClose }: FilterAuctionProps) {
    const { api } = useApi();
    const [query, setQuery] = useState<string | undefined>();
    const [active, setActive] = useState<boolean | undefined>();
    const [minPriceInCents, setMinPrice] = useState<number | undefined>();
    const [maxPriceInCents, setMaxPrice] = useState<number | undefined>();
    const [minPriceInCentsInput, setMinPriceInput] = useState("");
    const [maxPriceInCentsInput, setMaxPriceInput] = useState("");
    const [auctions, setAuctions] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [err, setErr] = useState("");

    if (!isClicked) return null;

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setIsSubmitting(true);
        const queryParams = {query, active, minPriceInCents, maxPriceInCents};
        try {
            const auctionRes = await api.searchAuctions(queryParams);

            const filteredAuctions = auctionRes.filter(a => {
                if (query && (a.title.toLocaleLowerCase() !== query.toLowerCase())) { return false; }

                if (active !== undefined && a.active !== active) { return false; }

                if (minPriceInCentsInput !== undefined && a.minPriceInCents < Number(minPriceInCentsInput)) { return false; }

                if (maxPriceInCentsInput !== undefined && a.maxPriceInCents > Number(maxPriceInCentsInput)) { return false; }

                return true;
            })

            setAuctions(filteredAuctions);
            alert("Auctions retrieved!!");
        } catch (err) {
            setErr("Failed to find your auctions");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleMinPrice(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setMinPriceInput(minPriceInCentsInput);
        const dollars = parseFloat(val) || 0;
        setMinPrice(Math.round(dollars * 100));
    }

    function handleMaxPrice(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setMaxPriceInput(maxPriceInCentsInput);
        const dollars = parseFloat(val) || 0;
        setMaxPrice(Math.round(dollars * 100));
    }

    function handleMinPriceBlur() {
        if (minPriceInCentsInput === "") return;
        const dollars = parseFloat(minPriceInCentsInput) || 0;
        setMinPriceInput(dollars.toFixed(2));
        setMinPrice(Math.round(dollars * 100));
    }

    function handleMaxPriceBlur() {
        if (maxPriceInCentsInput === "") return;
        const dollars = parseFloat(maxPriceInCentsInput) || 0;
        setMaxPriceInput(dollars.toFixed(2));
        setMaxPrice(Math.round(dollars * 100));
    }

    function handleCancel() {
        setQuery("");
        setActive(false);
        setMinPrice(0);
        setMaxPrice(0);
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

                <div className="modal__quick-add">
                    <form onSubmit={handleSearch}>
                        <input
                            type="string"
                            className="input-field modal__amount-input"
                            placeholder="Item Name:"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />

                        <label>
                            Active:
                            <input 
                                type="checkbox"
                                className="input-field modal__amount-input"
                                checked={active}
                                onChange={() => setActive(!active)}
                            />
                        </label>

                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="Min Price"
                            value={minPriceInCentsInput}
                            onChange={handleMinPrice}
                            onBlur={handleMinPriceBlur}
                        />

                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="Max Price"
                            value={maxPriceInCentsInput}
                            onChange={handleMaxPrice}
                            onBlur={handleMaxPriceBlur}
                        />

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
                    </form>
                </div>
            </div>
        </div>
    );
}
