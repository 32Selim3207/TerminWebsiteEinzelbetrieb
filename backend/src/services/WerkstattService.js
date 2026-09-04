const Werkstatt = require('../model/Werkstatt');

// Sadece bu alanların güncellenmesine izin ver.
// Email/password/role/id gibi kritik alanları asla kabul etme.
const UPDATABLE_FIELDS = ['services', 'blockedDates', 'openingHours', 'phone', 'address', 'name'];

class WerkstattService {
  static async getAllWerkstaette() {
    return await Werkstatt.find({}, '-password');
  }

  static async getWerkstattById(id) {
    return await Werkstatt.findById(id, '-password');
  }

  /**
   * Oturum açmış Werkstatt'ın kendi profilini döner.
   */
  static async getOwnProfile(werkstattId) {
    const werkstatt = await Werkstatt.findById(werkstattId, '-password');
    if (!werkstatt) throw new Error('Werkstatt nicht gefunden.');
    return werkstatt;
  }

  /**
   * Oturum açmış Werkstatt'ın profilini kısmi olarak günceller.
   * Sadece whitelist'teki alanlar geçirilir.
   */
  static async updateOwnProfile(werkstattId, patch) {
    const update = {};
    for (const key of UPDATABLE_FIELDS) {
      if (patch[key] !== undefined) update[key] = patch[key];
    }
    if (Object.keys(update).length === 0) {
      throw new Error('Keine gültigen Felder zum Aktualisieren.');
    }
    const werkstatt = await Werkstatt.findByIdAndUpdate(
      werkstattId,
      { $set: update },
      { new: true, runValidators: true, projection: '-password' }
    );
    if (!werkstatt) throw new Error('Werkstatt nicht gefunden.');
    return werkstatt;
  }
}

module.exports = WerkstattService;