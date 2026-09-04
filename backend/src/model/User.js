const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, default: 'kunde' }, // 'kunde'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);