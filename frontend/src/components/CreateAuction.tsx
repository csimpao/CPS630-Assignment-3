import { useEffect, useState } from 'react';
import { useApi } from '../providers/api';

interface CreateAuctionProps {
  isClicked: boolean;
  onClose: () => void;
}

export default function CreateAuction({ isClicked, onClose }: CreateAuctionProps) {
    const { api } = useApi();
    const [title, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startingPriceCents, setStartingPrice] = useState(0);
    const [endTimeUtc, setEndTime] = useState(new Date("December 31, 2026 23:59:00"));
    const [err, setErr] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isClicked) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await api.createAuction({title, description, startingPriceCents, endTimeUtc});
            alert("Auction created!!");
            setIsSubmitting(true);
            setName("");
            setDescription("");
            setStartingPrice(0);
            setEndTime(new Date("December 31, 2026 23:59:00"));
            onClose();
        } catch (err) {
            setErr("Failed to create an auction");
        }
    }

    function handleCancel() {
        setName("");
        setDescription("");
        setStartingPrice(0);
        setEndTime(new Date("December 31, 2026 23:59:00"));
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
                    <h2 className="modal__title">CREATE AUCTION</h2>
                    <button className="modal__close" type="button" onClick={handleCancel}>
                        &times;
                    </button>
                </div>

                <label className="label">Put in an item you want to auction!!</label>

                <div className="modal__quick-add">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="Set Item Name:"
                            value={title}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="Set Item Description:"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="number"
                            className="input-field modal__amount-input"
                            placeholder="Set Item Price:"
                            value={startingPriceCents}
                            onChange={(e) => setStartingPrice(Number(e.target.value))}
                        />

                        <input
                            type="datetime-local"
                            className="input-field modal__amount-input"
                            placeholder="Set End Bidding Date:"
                            value={endTimeUtc}
                            onChange={(e) => setEndTime(new Date(e.target.value))}
                        />

                        <button
                            className="btn btn-primary btn-full modal__confirm"
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                        {isSubmitting ? 'CREATING YOUR AUCTION...' : 'CONFIRM'}
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
