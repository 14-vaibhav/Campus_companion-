const db = require('../config/db');

// Get all restaurants
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { location, is_open, limit, offset, page } = req.query;
    let query = 'SELECT * FROM restaurants WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) FROM restaurants WHERE 1=1';
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

// Get restaurant by ID
exports.getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create a new restaurant
exports.createRestaurant = async (req, res, next) => {
  try {
    const {
      name, description, disclaimer, location, phone_number,
      logo_url, menu_images, opening_time, closing_time, is_open,
      is_verified, average_cost_for_one
    } = req.body;

    const query = `
      INSERT INTO restaurants (
        name, description, disclaimer, location, phone_number,
        logo_url, menu_images, opening_time, closing_time, is_open,
        is_verified, average_cost_for_one
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    // Make sure menu_images is parsed / saved as a valid JSON object or array string
    const menuImagesJson = menu_images ? JSON.stringify(menu_images) : null;

    const params = [
      name, description, disclaimer, location, phone_number,
      logo_url || null, menuImagesJson, opening_time || null, closing_time || null,
      is_open !== undefined ? is_open : true,
      is_verified !== undefined ? is_verified : false,
      average_cost_for_one || null
    ];

    const { rows } = await db.query(query, params);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update restaurant
exports.updateRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name, description, disclaimer, location, phone_number,
      logo_url, menu_images, opening_time, closing_time, is_open,
      is_verified, average_cost_for_one
    } = req.body;

    // First check if it exists
    const checkExist = await db.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (checkExist.rows.length === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const current = checkExist.rows[0];
    const menuImagesJson = menu_images ? JSON.stringify(menu_images) : (current.menu_images ? JSON.stringify(current.menu_images) : null);

    const query = `
      UPDATE restaurants SET
        name = $1, description = $2, disclaimer = $3, location = $4, phone_number = $5,
        logo_url = $6, menu_images = $7, opening_time = $8, closing_time = $9,
        is_open = $10, is_verified = $11, average_cost_for_one = $12, updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `;

    const params = [
      name !== undefined ? name : current.name,
      description !== undefined ? description : current.description,
      disclaimer !== undefined ? disclaimer : current.disclaimer,
      location !== undefined ? location : current.location,
      phone_number !== undefined ? phone_number : current.phone_number,
      logo_url !== undefined ? logo_url : current.logo_url,
      menuImagesJson,
      opening_time !== undefined ? opening_time : current.opening_time,
      closing_time !== undefined ? closing_time : current.closing_time,
      is_open !== undefined ? is_open : current.is_open,
      is_verified !== undefined ? is_verified : current.is_verified,
      average_cost_for_one !== undefined ? average_cost_for_one : current.average_cost_for_one,
      id
    ];

    const { rows } = await db.query(query, params);
    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM restaurants WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    next(error);
  }
};
