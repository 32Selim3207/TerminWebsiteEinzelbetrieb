const bcrypt = require('bcryptjs');
const User = require('../model/User');
const Werkstatt = require('../model/Werkstatt');
const JWTService = require('./JWTService');

class AuthService {
  static async registerKunde(data) {
    const { name, email, password, phone } = data;
    const existing = await User.findOne({ email });
    if (existing) throw new Error('Diese E-Mail ist bereits registriert.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();

    const token = JWTService.generateToken({ id: user._id, role: 'kunde' });
    return { token, user: { id: user._id, name: user.name, email: user.email, role: 'kunde' } };
  }

  static async loginKunde(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('E-Mail oder Passwort falsch.');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('E-Mail oder Passwort falsch.');

    const token = JWTService.generateToken({ id: user._id, role: 'kunde' });
    return { token, user: { id: user._id, name: user.name, email: user.email, role: 'kunde' } };
  }

  static async registerWerkstatt(data) {
    const { name, ownerName, email, password, phone, address, city } = data;
    const existing = await Werkstatt.findOne({ email });
    if (existing) throw new Error('Diese E-Mail ist bereits registriert.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultServices = [
      { id: 'wartung', label: 'Allgemeine Wartung', desc: 'Inspektion und Ölwechsel', duration: 60, price: 120 },
      { id: 'reifen', label: 'Reifenwechsel', desc: 'Saisonwechsel aller Reifen', duration: 30, price: 50 },
      { id: 'unbekannt', label: 'Unbekanntes Problem', desc: 'Fehlerdiagnose', duration: 45, price: 80 }
    ];

    const werkstatt = new Werkstatt({
      name, ownerName, email, password: hashedPassword, phone, address, city,
      services: defaultServices
    });
    await werkstatt.save();

    const token = JWTService.generateToken({ id: werkstatt._id, role: 'werkstatt' });
    return { token, werkstatt: { id: werkstatt._id, name: werkstatt.name, email: werkstatt.email, role: 'werkstatt' } };
  }

  static async loginWerkstatt(email, password) {
    const werkstatt = await Werkstatt.findOne({ email });
    if (!werkstatt) throw new Error('E-Mail oder Passwort falsch.');

    const valid = await bcrypt.compare(password, werkstatt.password);
    if (!valid) throw new Error('E-Mail oder Passwort falsch.');

    const token = JWTService.generateToken({ id: werkstatt._id, role: 'werkstatt' });
    return { token, werkstatt: { id: werkstatt._id, name: werkstatt.name, email: werkstatt.email, role: 'werkstatt' } };
  }
}

module.exports = AuthService;