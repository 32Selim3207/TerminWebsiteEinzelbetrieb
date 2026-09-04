const express = require('express');
const router = express.Router();
const AppointmentService = require('../services/AppointmentService');
const { authMiddleware, requireWerkstatt } = require('../middleware/authMiddleware');

// ---------- PUBLIC (Kunde tarafı) ----------

// Boş saatleri getir
router.get('/slots', async (req, res) => {
  try {
    const { werkstattId, date, serviceId } = req.query;
    const slots = await AppointmentService.getAvailableSlots(werkstattId, date, serviceId);
    res.json(slots);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Yeni randevu oluştur (misafir de yapabilir)
router.post('/', async (req, res) => {
  try {
    const appointment = await AppointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Kod + email ile randevu arama
router.post('/search', async (req, res) => {
  try {
    const { code, email } = req.body;
    const appointment = await AppointmentService.findByCodeAndEmail(code, email);
    res.json(appointment);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Randevu iptali (kod + email doğrulaması service içinde yapılıyor)
router.patch('/cancel', async (req, res) => {
  try {
    const { code, email } = req.body;
    const appointment = await AppointmentService.cancelAppointment(code, email);
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- PROTECTED (Werkstatt admin paneli) ----------

// Werkstatt'ın tüm randevuları — sadece kendi randevularını görebilir
router.get(
  '/werkstatt/:werkstattId',
  authMiddleware,
  requireWerkstatt,
  async (req, res) => {
    try {
      if (req.user.id !== req.params.werkstattId) {
        return res.status(403).json({
          error: 'Sie können nur Ihre eigenen Termine einsehen.'
        });
      }
      const appointments = await AppointmentService.getAppointmentsForWerkstatt(
        req.params.werkstattId
      );
      res.json(appointments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Durum güncelleme — sadece randevunun sahibi Werkstatt
router.patch(
  '/:id/status',
  authMiddleware,
  requireWerkstatt,
  async (req, res) => {
    try {
      const { status } = req.body;
      const appointment = await AppointmentService.updateStatus(
        req.params.id,
        status,
        req.user.id
      );
      res.json(appointment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

module.exports = router;