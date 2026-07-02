const { pool } = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  try {
    const username = 'vaibhav';
    const email = 'vaibhav@campus.admin';
    const password = '14.vaibhav';
    const role = 'admin';

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Checking if admin already exists in database...');
    const checkRes = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (checkRes.rows.length > 0) {
      console.log('Admin user with username or email already exists.');
      return;
    }

    console.log('Seeding admin user into "users" table...');
    const insertRes = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, role]
    );

    console.log('Admin user successfully seeded:', insertRes.rows[0]);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

seedAdmin();
