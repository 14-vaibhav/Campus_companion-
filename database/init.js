const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/db');

async function initializeDatabase() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    console.log(`Reading schema file from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running schema setup queries against database...');
    await pool.query(schemaSql);
    console.log('Database initialization successful! All tables created.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

initializeDatabase();
