const Appointment = require('../model/Appointment');
const Werkstatt = require('../model/Werkstatt');

function generateCode(werkstattName) {
  const prefix = (werkstattName || 'MG').substring(0, 2).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${random}`;
}

function addMinutes(time, minutes) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

class AppointmentService {
  // Belirli gün ve serviste boş saatleri hesaplar
  static async getAvailableSlots(werkstattId, date, serviceId) {
    const werkstatt = await Werkstatt.findById(werkstattId);
    if (!werkstatt) throw new Error('Werkstatt nicht gefunden.');

    if (werkstatt.blockedDates.includes(date)) return [];

    const service = werkstatt.services.find(s => s.id === serviceId);
    if (!service) throw new Error('Service nicht gefunden.');
    const duration = service.duration;

    // Basit varsayım: Pazartesi-Cuma 07:00-17:00, Cumartesi 07:00-12:00
    const day = new Date(date).getDay(); // 0=Pazar, 6=Cumartesi
    if (day === 0) return []; // Pazar kapalı

    const startHour = 7;
    const endHour = day === 6 ? 12 : 17;

    const existing = await Appointment.find({
      werkstattId,
      date,
      status: { $ne: 'storniert' }
    });

    const slots = [];
    let cursor = `${String(startHour).padStart(2, '0')}:00`;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    while (cursor < endTime) {
      const slotEnd = addMinutes(cursor, duration);
      if (slotEnd > endTime) break;

      const overlaps = existing.some(a => cursor < a.endTime && slotEnd > a.startTime);
      if (!overlaps) slots.push(cursor);

      cursor = addMinutes(cursor, 15); // 15 dakikalık aralıklarla kontrol
    }

    return slots;
  }

  static async createAppointment(data) {
    const { werkstattId, serviceType, date, startTime } = data;

    const werkstatt = await Werkstatt.findById(werkstattId);
    if (!werkstatt) throw new Error('Werkstatt nicht gefunden.');

    const service = werkstatt.services.find(s => s.id === serviceType);
    if (!service) throw new Error('Service nicht gefunden.');

    const endTime = addMinutes(startTime, service.duration);

    // Çakışma kontrolü
    const conflict = await Appointment.findOne({
      werkstattId,
      date,
      status: { $ne: 'storniert' },
      $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }]
    });
    if (conflict) throw new Error('Dieser Zeitslot ist bereits vergeben.');

    let code;
    let unique = false;
    while (!unique) {
      code = generateCode(werkstatt.name);
      const exists = await Appointment.findOne({ appointmentCode: code });
      if (!exists) unique = true;
    }

    const appointment = new Appointment({
      ...data,
      appointmentCode: code,
      endTime,
      duration: service.duration
    });

    await appointment.save();
    return appointment;
  }

  static async findByCodeAndEmail(code, email) {
    const appointment = await Appointment.findOne({
      appointmentCode: code,
      customerEmail: email.toLowerCase()
    });
    if (!appointment) throw new Error('Termin nicht gefunden.');
    return appointment;
  }

  static async cancelAppointment(code, email) {
    const appointment = await AppointmentService.findByCodeAndEmail(code, email);
    appointment.status = 'storniert';
    await appointment.save();
    return appointment;
  }

  static async getAppointmentsForWerkstatt(werkstattId) {
    return await Appointment.find({ werkstattId }).sort({ date: 1, startTime: 1 });
  }

  /**
   * Randevu durumunu günceller.
   * werkstattId verilirse, randevunun o Werkstatt'a ait olduğu kontrol edilir.
   */
  static async updateStatus(appointmentId, status, werkstattId = null) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new Error('Termin nicht gefunden.');

    if (werkstattId && appointment.werkstattId.toString() !== werkstattId) {
      throw new Error('Sie können nur Ihre eigenen Termine bearbeiten.');
    }

    appointment.status = status;
    await appointment.save();
    return appointment;
  }
}

module.exports = AppointmentService;