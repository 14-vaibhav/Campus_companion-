const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Campus Companion backend is running' });
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Campus Companion Backend API is healthy' });
});

// Silences Chrome DevTools 404/CSP warning
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.json({});
});

// Import route modules
const salonRoutes = require('./routes/salonRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const laundryRoutes = require('./routes/laundryRoutes');
const cabRoutes = require('./routes/cabRoutes');
const autoRoutes = require('./routes/autoRoutes');

// Mount routes
app.use('/api/salons', salonRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/laundries', laundryRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/autos', autoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

module.exports = app;
