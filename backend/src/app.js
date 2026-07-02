const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Ensure Swagger UI styles and scripts load correctly
}));
// CORS — allow localhost in dev, read ALLOWED_ORIGIN from .env in production
const allowedOrigins = [
  'http://localhost:5173',   // Vite dev server
  'http://localhost:4173',   // Vite preview
  'http://localhost:3000',   // fallback
  process.env.ALLOWED_ORIGIN // production frontend URL (set in .env)
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman) or from allowed list
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: origin ${origin} is not allowed`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generic Rate Limiter for all API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes'
    }
  }
});

// Strict Rate Limiter for Auth endpoints (Login, Register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/registration requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      message: 'Too many login or registration attempts, please try again after 15 minutes'
    }
  }
});

// Apply rate limiters
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

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
const authRoutes = require('./routes/authRoutes');
const salonRoutes = require('./routes/salonRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const laundryRoutes = require('./routes/laundryRoutes');
const cabRoutes = require('./routes/cabRoutes');
const autoRoutes = require('./routes/autoRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/laundries', laundryRoutes);
app.use('/api/cabs', cabRoutes);
app.use('/api/autos', autoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);

// Mount API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

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
