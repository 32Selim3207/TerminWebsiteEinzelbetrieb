const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/authentication');
const werkstattRoutes = require('./src/routes/werkstatt');
const appointmentRoutes = require('./src/routes/appointment'); // YENİ

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/werkstaette', werkstattRoutes);
app.use('/api/appointments', appointmentRoutes); // YENİ

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend katmanlı mimari ile çalışıyor' });
});

module.exports = app;