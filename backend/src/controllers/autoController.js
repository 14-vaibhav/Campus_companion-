const db = require('../config/db');

// Get all autos
exports.getAllAutos = async (req, res, next) => {
  try {
    const { is_verified, limit, offset, page } = req.query;
    let query = 'SELECT * FROM autos WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM autos WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (is_verified !== undefined) {
      const isVerifiedVal = is_verified === 'true';
      query += ` AND is_verified = $${paramIndex}`;
      countQuery += ` AND is_verified = $${paramIndex}`;
      params.push(isVerifiedVal);
      paramIndex++;
    }

    const hasPagination = limit !== undefined || offset !== undefined || page !== undefined;

    if (hasPagination) {
      const parsedLimit = parseInt(limit) || 10;
      const parsedPage = parseInt(page) || 1;
      const parsedOffset = offset !== undefined ? parseInt(offset) : (parsedPage - 1) * parsedLimit;

      // Count total records
      const countRes = await db.query(countQuery, params);
      const total = parseInt(countRes.rows[0].count);

      // Fetch paginated data
      const dataQuery = query + ` ORDER BY id ASC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      const dataParams = [...params, parsedLimit, parsedOffset];

      const { rows } = await db.query(dataQuery, dataParams);
      res.status(200).json({
        total,
        limit: parsedLimit,
        offset: parsedOffset,
        page: page !== undefined ? parsedPage : Math.floor(parsedOffset / parsedLimit) + 1,
        data: rows
      });
    } else {
      query += ' ORDER BY id ASC';
      const { rows } = await db.query(query, params);
      res.status(200).json(rows);
    }
  } catch (error) {
    next(error);
  }
};

// Get auto by ID
exports.getAutoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM autos WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Auto driver not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create a new auto
exports.createAuto = async (req, res, next) => {
  try {
    const { driver_name, vehicle_number, phone_number } = req.body;

    const query = `
      INSERT INTO autos (
        driver_name, vehicle_number, phone_number
      ) VALUES ($1, $2, $3)
      RETURNING *
    `;

    const params = [driver_name, vehicle_number, phone_number];

    const { rows } = await db.query(query, params);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update auto
exports.updateAuto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { driver_name, vehicle_number, phone_number } = req.body;

    // Check if exists
    const checkExist = await db.query('SELECT * FROM autos WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Auto driver not found' });
    }

    const current = checkExist.rows[0];

    const query = `
      UPDATE autos SET
        driver_name = $1, vehicle_number = $2, phone_number = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    const params = [
      driver_name !== undefined ? driver_name : current.driver_name,
      vehicle_number !== undefined ? vehicle_number : current.vehicle_number,
      phone_number !== undefined ? phone_number : current.phone_number,
      id
    ];

    const { rows } = await db.query(query, params);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete auto
exports.deleteAuto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM autos WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Auto driver not found' });
    }
    res.status(200).json({ message: 'Auto driver deleted successfully' });
  } catch (error) {
    next(error);
  }
};
