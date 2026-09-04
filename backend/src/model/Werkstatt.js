const mongoose = require('mongoose');

const werkstattSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Örn: Murat Garajı
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true, default: 'München' },
  category: { type: String, default: 'KFZ-Werkstatt' }, // Gelecekte Frisör, Kosmetik vb. yapılabilir
  services: [{
    id: String,          // 'wartung', 'reifen', 'motor', 'lackierung', 'waesche'
    label: String,       // 'Allgemeine Wartung'
    desc: String,
    price: Number,       // Opsiyonel fiyat teklifi
    duration: Number     // Dakika cinsinden (Örn: 60)
  }],
  openingHours: {
    weekdays: { type: String, default: '07:00 - 17:00' },
    saturday: { type: String, default: '07:00 - 12:00' },
    sunday: { type: String, default: 'Geschlossen' }
  },
  blockedDates: [String], // YYYY-MM-DD biçiminde kapalı günler
  role: { type: String, default: 'werkstatt' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Werkstatt', werkstattSchema);