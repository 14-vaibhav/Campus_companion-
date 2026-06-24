const db = require('../config/db');

// Get all laundries
exports.getAllLaundries = async (req, res, next) => {
  try {
    const { location, is_open, limit, offset, page } = req.query;
    let query = 'SELECT * FROM laundries WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM laundries WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (location) {
      query += ` AND location ILIKE $${paramIndex}`;
      countQuery += ` AND location ILIKE $${paramIndex}`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (is_open !== undefined) {
      const isOpenVal = is_open === 'true';
      query += ` AND is_open = $${paramIndex}`;
      countQuery += ` AND is_open = $${paramIndex}`;
      params.push(isOpenVal);
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

// Get laundry by ID
exports.getLaundryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM laundries WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Laundry not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create a new laundry
exports.createLaundry = async (req, res, next) => {
  try {
    const {
      name, description, location, price_per_kg, phone_number,
      opening_time, closing_time, is_open, is_verified, logo_url
    } = req.body;

    const query = `
      INSERT INTO laundries (
        name, description, location, price_per_kg, phone_number,
        opening_time, closing_time, is_open, is_verified, logo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;

    const params = [
      name, description, location, price_per_kg || null, phone_number,
      opening_time || null, closing_time || null,
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

// Update laundry
exports.updateLaundry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name, description, location, price_per_kg, phone_number,
      opening_time, closing_time, is_open, is_verified, logo_url
    } = req.body;

    // Check if exists
    const checkExist = await db.query('SELECT * FROM laundries WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Laundry not found' });
    }

    const current = checkExist.rows[0];

    const query = `
      UPDATE laundries SET
        name = $1, description = $2, location = $3, price_per_kg = $4, phone_number = $5,
        opening_time = $6, closing_time = $7, is_open = $8, is_verified = $9,
        logo_url = $10, updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `;

    const params = [
      name !== undefined ? name : current.name,
      description !== undefined ? description : current.description,
      location !== undefined ? location : current.location,
      price_per_kg !== undefined ? price_per_kg : current.price_per_kg,
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

// Delete laundry
exports.deleteLaundry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM laundries WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Laundry not found' });
    }
    res.status(200).json({ message: 'Laundry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
