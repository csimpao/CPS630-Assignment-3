import { useEffect, useState } from 'react';
import { useApi } from '../providers/api';
import NewAuctionButton from './dashboard/NewAuctionButton';
import SearchAuctions from './dashboard/SearchAuctions';

export default function CreateAuction() {
    const { api } = useApi();
    const [title, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startingPriceCents, setStartingPrice] = useState(0);
    const [endTimeUtc, setEndTime] = useState(new Date("December 31, 2026 23:59:00"));
    const [err, setErr] = useState("");
    const [auctId, setAuctId] = useState(0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await api.createAuction({title, description, startingPriceCents, endTimeUtc});
            alert("Auction created!!");

            setName("");
            setDescription("");
            setStartingPrice(0);
            setEndTime(new Date("December 31, 2026 23:59:00"));
        } catch (err) {
            setErr("Failed to create an auction");
        }
    }

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        try {
            await api.getAuction(auctId);
            alert("Auctions retrieved!!");
            setAuctId(0);
        } catch (err) {
            setErr("Failed to find your auctions");
        }
    }

    return (
        <div>
            <h2>Created Auction(s)</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Set Item Name:"
                    value={title}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Set Item Description:"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Set Item Price:"
                    value={startingPriceCents}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                />

                <input
                    type="date"
                    placeholder="Set End Bidding Date:"
                    value={endTimeUtc}
                    onChange={(e) => setEndTime(new Date(e.target.value))}
                />

                <NewAuctionButton />
            </form>

            <form onSubmit={handleSearch}>
                <input
                    type="number"
                    placeholder="Type in the ID for your chosen auction(s):"
                    value={auctId}
                    onChange={(e) => setAuctId(Number(e.target.value))}
                />

                <SearchAuctions />
            </form>
        </div>
    );
}
