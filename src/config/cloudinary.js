const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('\n========================================================================');
  console.warn('WARNING: Cloudinary configuration variables are missing in your .env file!');
  console.warn('Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.');
  console.warn('Image uploads via /api/upload will fail.');
  console.warn('========================================================================\n');
}

cloudinary.config({
  cloud_name: cloudName || 'placeholder_cloud_name',
  api_key: apiKey || 'placeholder_api_key',
  api_secret: apiSecret || 'placeholder_api_secret'
});

module.exports = cloudinary;
