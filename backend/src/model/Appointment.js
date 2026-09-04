const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentCode: { type: String, required: true, unique: true }, // Örn: MG-7F3K9
  werkstattId: { type: mongoose.Schema.Types.ObjectId, ref: 'Werkstatt', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Kayıtlı kullanıcı ise
  serviceType: { type: String, required: true },
  problemNote: { type: String, default: '' },
  vehicleBrand: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  vehicleYear: { type: String, default: '' },
  licensePlate: { type: String, default: '' },
  date: { type: String, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // HH:MM
  endTime: { type: String, required: true }, // HH:MM
  duration: { type: Number, required: true }, // Dakika
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerEmail: { type: String, required: true, lowercase: true },
  status: { type: String, enum: ['geplant', 'abgeschlossen', 'storniert'], default: 'geplant' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);