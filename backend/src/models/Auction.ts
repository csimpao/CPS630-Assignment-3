import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema(
  {
    bidId: { type: Number, required: true },
    auctionId: { type: Number, required: true },
    userId: { type: Number, required: true },
    bidInCents: { type: Number, required: true },
    bidTimeUtc: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const auctionSchema = new mongoose.Schema({
  auctionId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingPriceCents: { type: Number, required: true },
  startTimeUtc: { type: Date, required: true, default: () => new Date() },
  endTimeUtc: { type: Date, required: true },
  active: { type: Boolean, required: true, default: true },
  bids: { type: [bidSchema], default: [] },
});

auctionSchema.index({ active: 1 });
auctionSchema.index({ startingPriceCents: 1 });
auctionSchema.index({ endTimeUtc: 1 });

export const AuctionModel = mongoose.model('Auction', auctionSchema);
