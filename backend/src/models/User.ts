import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  balanceInCents: { type: Number, required: true, default: 0 },
  participatedAuctions: { type: [Number], default: [] },
});

export const UserModel = mongoose.model('User', userSchema);
