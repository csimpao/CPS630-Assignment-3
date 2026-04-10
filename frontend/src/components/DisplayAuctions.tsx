import { useState, useEffect } from 'react';

function DisplayAuctions({ refreshTrigger }) {
    const [auctions, setAuctions] = useState([]);

    async function getAuctions() {
        try {
            const res = await fetch('/api/auction');
            const auctionData = await res.json();
            setAuctions(auctionData);
        } catch (err) {
            alert("Error in displaying the auctions: " + err);
        }
    }
    useEffect(() => {
        getAuctions();
    }, [refreshTrigger]);

    return (
        <>
            <h2>All Current Auctions</h2>
            <div className="dashboard__content">
                {auctions.map(a => {
                    return (
                        <div key={a.auctionId}>
                            <p>
                                ID: {a.auctionId}<br></br>
                                Item: {a.title}<br></br>
                                Description: {a.description}<br></br>
                                Start: {a.startTimeUtc}<br></br>
                                End: {a.endTimeUtc}<br></br>
                                Availability: {a.active}<br></br>
                                All Biddings: {a.bids}<br></br>
                            </p>
                        </div>
                    )
                })};
            </div>
        </>
    )
}
