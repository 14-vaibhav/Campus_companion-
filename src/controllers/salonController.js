const db = require('../config/db');

// Get all salons
exports.getAllSalons = async (req, res, next) => {
  try {
    const { location, is_open } = req.query;
    let query = 'SELECT * FROM salons WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (location) {
      query += ` AND location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (is_open !== undefined) {
      query += ` AND is_open = $${paramIndex}`;
      params.push(is_open === 'true');
      paramIndex++;
    }

    query += ' ORDER BY id ASC';
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

// Get salon by ID
exports.getSalonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM salons WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Salon not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create a new salon
exports.createSalon = async (req, res, next) => {
  try {
    const {
      name, description, location, haircut_price, beard_price,
      phone_number, opening_time, closing_time, is_open, is_verified, logo_url
    } = req.body;

    const query = `
      INSERT INTO salons (
        name, description, location, haircut_price, beard_price,
        phone_number, opening_time, closing_time, is_open, is_verified, logo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const params = [
      name, description, location, haircut_price, beard_price,
      phone_number, opening_time || null, closing_time || null,
      is_open !== undefined ? is_open : true,
      is_verified !== undefined ? is_verified : false,
      logo_url || null
    ];

    const { rows } = await db.query(query, params);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update salon
exports.updateSalon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name, description, location, haircut_price, beard_price,
      phone_number, opening_time, closing_time, is_open, is_verified, logo_url
    } = req.body;

    // First check if it exists
    const checkExist = await db.query('SELECT * FROM salons WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    const current = checkExist.rows[0];

    const query = `
      UPDATE salons SET
        name = $1, description = $2, location = $3, haircut_price = $4, beard_price = $5,
        phone_number = $6, opening_time = $7, closing_time = $8, is_open = $9,
        is_verified = $10, logo_url = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;

    const params = [
      name !== undefined ? name : current.name,
      description !== undefined ? description : current.description,
      location !== undefined ? location : current.location,
      haircut_price !== undefined ? haircut_price : current.haircut_price,
      beard_price !== undefined ? beard_price : current.beard_price,
      phone_number !== undefined ? phone_number : current.phone_number,
      opening_time !== undefined ? opening_time : current.opening_time,
      closing_time !== undefined ? closing_time : current.closing_time,
      is_open !== undefined ? is_open : current.is_open,
      is_verified !== undefined ? is_verified : current.is_verified,
      logo_url !== undefined ? logo_url : current.logo_url,
      id
    ];

    const { rows } = await db.query(query, params);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete salon
exports.deleteSalon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM salons WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Salon not found' });
    }
    res.status(200).json({ message: 'Salon deleted successfully' });
  } catch (error) {
    next(error);
  }
};
