// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

export default User;