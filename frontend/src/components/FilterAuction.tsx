import { useEffect, useState } from 'react';
import { useApi } from '../providers/api';
import SearchAuctions from './dashboard/SearchAuctions';

export default function CreateAuction() {
    const { api } = useApi();
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(false);
    const [minPriceInCents, setMinPrice] = useState(0);
    const [maxPriceInCents, setMaxPrice] = useState(0);
    const [err, setErr] = useState("");

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const queryParams = {query, active, minPriceInCents, maxPriceInCents};
        try {
            await api.searchAuctions(queryParams);
            alert("Auctions retrieved!!");
        } catch (err) {
            setErr("Failed to find your auctions");
        }
    }

    return (
        <div>
            <h2>Searched Auction(s)</h2>

            <form onSubmit={handleSearch}>
                <input
                    type="string"
                    placeholder="Type in the item to auction on:"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                <SearchAuctions />
            </form>
        </div>
    );
}
