const JWTService = require('../services/JWTService');

/**
 * Authorization: Bearer <token> header'ını doğrular.
 * Başarılıysa req.user = { id, role } olarak ekler.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Kein Token bereitgestellt.' });
  }

  const token = header.substring(7);
  try {
    const payload = JWTService.verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Ungültiger oder abgelaufener Token.' });
  }
}

/**
 * Sadece 'werkstatt' rolündeki kullanıcıların geçmesine izin verir.
 * authMiddleware'den SONRA takılmalı.
 */
function requireWerkstatt(req, res, next) {
  if (!req.user || req.user.role !== 'werkstatt') {
    return res.status(403).json({ error: 'Zugriff verweigert. Nur für Werkstätten.' });
  }
  next();
}

/**
 * Sadece 'kunde' rolündeki kullanıcıların geçmesine izin verir.
 * (İleride kunde-özel route'lar için hazır.)
 */
function requireKunde(req, res, next) {
  if (!req.user || req.user.role !== 'kunde') {
    return res.status(403).json({ error: 'Zugriff verweigert. Nur für Kunden.' });
  }
  next();
}

module.exports = { authMiddleware, requireWerkstatt, requireKunde };