const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user' },
  tokens: [tokenSchema], // Array of tokens (for JWT tokens)
  resetToken: { type: String }, // Field for password reset token
  secret: { type: String }, // 2FA secret
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
