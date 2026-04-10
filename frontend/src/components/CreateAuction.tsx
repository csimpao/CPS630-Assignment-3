import { useEffect, useState } from 'react';
import { useApi } from '../providers/api';

interface CreateAuctionProps {
  isClicked: boolean;
  onClose: () => void;
}

function getDefaultEndTime(): Date {
    const d = new Date();
    d.setHours(d.getHours() + 24);
    return d;
}

function toDatetimeLocal(date: Date): string {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
}

export default function CreateAuction({ isClicked, onClose }: CreateAuctionProps) {
    const { api } = useApi();
    const [title, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startingPriceCents, setStartingPrice] = useState(0);
    const [priceInput, setPriceInput] = useState("");

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value.replace(/[^0-9.]/g, '');
        setPriceInput(val);
        const dollars = parseFloat(val) || 0;
        setStartingPrice(Math.round(dollars * 100));
    }

    function handlePriceBlur() {
        if (priceInput === "") return;
        const dollars = parseFloat(priceInput) || 0;
        setPriceInput(dollars.toFixed(2));
        setStartingPrice(Math.round(dollars * 100));
    }
    const [endTimeUtc, setEndTime] = useState(getDefaultEndTime);
    const [err, setErr] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isClicked) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr("");
        setIsSubmitting(true);
        try {
            await api.createAuction({title, description, startingPriceCents, endTimeUtc});
            alert("Auction created!!");
            setName("");
            setDescription("");
            setStartingPrice(0);
            setPriceInput("");
            setEndTime(getDefaultEndTime());
            onClose();
        } catch (err) {
            setErr("Failed to create an auction");
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleCancel() {
        setName("");
        setDescription("");
        setStartingPrice(0);
        setPriceInput("");
        setEndTime(getDefaultEndTime());
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

                <label className="label">Please detail your auction</label>

                <div className="modal__quick-add">
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="Item Name:"
                            value={title}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="Description:"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <input
                            type="text"
                            className="input-field modal__amount-input"
                            placeholder="$0.00"
                            value={priceInput}
                            onChange={handlePriceChange}
                            onBlur={handlePriceBlur}
                        />

                        <input
                            type="datetime-local"
                            className="input-field modal__amount-input"
                            placeholder="Set End Bidding Date:"
                            value={toDatetimeLocal(endTimeUtc)}
                            onChange={(e) => setEndTime(new Date(e.target.value))}
                        />

                        {err && <p className="modal__error">{err}</p>}

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
