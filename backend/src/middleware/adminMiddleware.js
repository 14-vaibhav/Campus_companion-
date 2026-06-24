const jwt = require('jsonwebtoken');

const isProduction = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

if (isProduction) {
  if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
  }
  if (!ADMIN_SECRET_KEY) {
    throw new Error('FATAL: ADMIN_SECRET_KEY environment variable is required in production.');
  }
}

const JWT_KEY = JWT_SECRET || 'campus_companion_jwt_secret';
const ADMIN_KEY = ADMIN_SECRET_KEY || 'campus_companion_admin_secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // 1. Try JWT Role Verification
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      if (decoded && decoded.role === 'admin') {
        req.user = decoded;
        return next();
      }
    } catch (err) {
      // Fallback: If token matches the secure admin key, allow access.
      // In production, we must ensure it isn't using the default fallback string.
      if (token === ADMIN_KEY && (!isProduction || ADMIN_KEY !== 'campus_companion_admin_secret')) {
        req.user = { id: 0, username: 'system_admin', role: 'admin' };
        return next();
      }
    }

    // 2. Check if authorization matches the secure admin key directly
    if (token === ADMIN_KEY && (!isProduction || ADMIN_KEY !== 'campus_companion_admin_secret')) {
      req.user = { id: 0, username: 'system_admin', role: 'admin' };
      return next();
    }
  }

  return res.status(403).json({
    error: {
      message: 'Forbidden: Admin access required'
    }
  });
};
