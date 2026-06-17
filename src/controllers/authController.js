const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_companion_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await db.query('SELECT id FROM users WHERE email = ', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email is already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role === 'admin' ? 'admin' : 'user';
    const { rows } = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (, , , ) RETURNING id, username, email, role, created_at',
      [username || null, email, hashedPassword, userRole]
    );
    const user = rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { rows } = await db.query('SELECT * FROM users WHERE email = ', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(200).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }, token });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { rows } = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};
