import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true }
})

export default mongoose.model('User', userSchema);