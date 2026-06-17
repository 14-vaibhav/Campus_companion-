module.exports = (req, res, next) => {
  const adminSecret = process.env.ADMIN_SECRET_KEY || 'campus_companion_admin_secret';
  const xRole = req.headers['x-role'];
  const authHeader = req.headers['authorization'];

  // Check x-role header
  if (xRole === 'admin') {
    return next();
  }

  // Check Authorization bearer token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === adminSecret) {
      return next();
    }
  }

  return res.status(403).json({
    error: {
      message: 'Forbidden: Admin access required'
    }
  });
};
