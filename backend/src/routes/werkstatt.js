const express = require('express');
const router = express.Router();
const WerkstattService = require('../services/WerkstattService');
const { authMiddleware, requireWerkstatt } = require('../middleware/authMiddleware');

// ---------- PROTECTED ----------
// ÖNEMLİ: /me route'u /:id'den ÖNCE tanımlanmalı.

router.get('/me', authMiddleware, requireWerkstatt, async (req, res) => {
  try {
    const werkstatt = await WerkstattService.getOwnProfile(req.user.id);
    res.json(werkstatt);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.patch('/me', authMiddleware, requireWerkstatt, async (req, res) => {
  try {
    const werkstatt = await WerkstattService.updateOwnProfile(req.user.id, req.body);
    res.json(werkstatt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------- PUBLIC ----------

router.get('/', async (req, res) => {
  try {
    const list = await WerkstattService.getAllWerkstaette();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const werkstatt = await WerkstattService.getWerkstattById(req.params.id);
    if (!werkstatt) return res.status(404).json({ error: 'Werkstatt nicht gefunden' });
    res.json(werkstatt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;