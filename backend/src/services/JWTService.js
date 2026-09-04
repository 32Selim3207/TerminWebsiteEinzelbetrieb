const jwt = require('jsonwebtoken');

class JWTService {
  static generateToken(payload) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }

  static verifyToken(token) {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    return jwt.verify(token, secret);
  }
}

module.exports = JWTService;