const express = require('express');
const router = express.Router();
const AuthService = require('../services/AuthService');

router.post('/kunde/register', async (req, res) => {
  try {
    const result = await AuthService.registerKunde(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/kunde/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginKunde(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/werkstatt/register', async (req, res) => {
  try {
    const result = await AuthService.registerWerkstatt(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/werkstatt/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginWerkstatt(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;