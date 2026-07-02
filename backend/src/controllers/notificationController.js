const db = require('../config/db');

exports.getAllNotifications = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM notifications WHERE expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP ORDER BY created_at DESC'
    );
    const mapped = rows.map(r => ({
      id: String(r.id),
      type: r.type,
      title: r.title,
      body: r.body,
      source: r.source,
      timestamp: r.created_at,
      expiresAt: r.expires_at
    }));
    res.status(200).json(mapped);
  } catch (error) {
    next(error);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const { type, title, body } = req.body;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { rows } = await db.query(
      'INSERT INTO notifications (type, title, body, source, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [type || 'info', title, body, 'admin', expiresAt]
    );

    const created = rows[0];
    res.status(201).json({
      id: String(created.id),
      type: created.type,
      title: created.title,
      body: created.body,
      source: created.source,
      timestamp: created.created_at,
      expiresAt: created.expires_at
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM notifications WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    next(error);
  }
};
