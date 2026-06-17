const db = require('../config/db');

// Get all cabs
exports.getAllCabs = async (req, res, next) => {
  try {
    const { is_verified } = req.query;
    let query = 'SELECT * FROM cabs WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (is_verified !== undefined) {
      query += ` AND is_verified = $${paramIndex}`;
      params.push(is_verified === 'true');
      paramIndex++;
    }

    query += ' ORDER BY id ASC';
    const { rows } = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

// Get cab by ID
exports.getCabById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM cabs WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cab driver not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create a new cab
exports.createCab = async (req, res, next) => {
  try {
    const { driver_name, vehicle_number, vehicle_model, phone_number, is_verified } = req.body;

    const query = `
      INSERT INTO cabs (
        driver_name, vehicle_number, vehicle_model, phone_number, is_verified
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const params = [
      driver_name,
      vehicle_number,
      vehicle_model || null,
      phone_number,
      is_verified !== undefined ? is_verified : false
    ];

    const { rows } = await db.query(query, params);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update cab
exports.updateCab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { driver_name, vehicle_number, vehicle_model, phone_number, is_verified } = req.body;

    // Check if exists
    const checkExist = await db.query('SELECT * FROM cabs WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Cab driver not found' });
    }

    const current = checkExist.rows[0];

    const query = `
      UPDATE cabs SET
        driver_name = $1, vehicle_number = $2, vehicle_model = $3, phone_number = $4,
        is_verified = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const params = [
      driver_name !== undefined ? driver_name : current.driver_name,
      vehicle_number !== undefined ? vehicle_number : current.vehicle_number,
      vehicle_model !== undefined ? vehicle_model : current.vehicle_model,
      phone_number !== undefined ? phone_number : current.phone_number,
      is_verified !== undefined ? is_verified : current.is_verified,
      id
    ];

    const { rows } = await db.query(query, params);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete cab
exports.deleteCab = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM cabs WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Cab driver not found' });
    }
    res.status(200).json({ message: 'Cab driver deleted successfully' });
  } catch (error) {
    next(error);
  }
};
