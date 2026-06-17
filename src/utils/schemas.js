const Joi = require('joi');

// Helper for time format validation (HH:MM or HH:MM:SS)
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

// ================= Cab Schemas =================
const cabPostSchema = Joi.object({
  driver_name: Joi.string().max(100).required(),
  vehicle_number: Joi.string().max(20).required(),
  vehicle_model: Joi.string().max(50).allow(null, ''),
  phone_number: Joi.string().max(20).required(),
  base_fare: Joi.number().integer().min(0).allow(null),
  is_available: Joi.boolean().default(true),
  is_verified: Joi.boolean().default(false)
});

const cabPutSchema = Joi.object({
  driver_name: Joi.string().max(100),
  vehicle_number: Joi.string().max(20),
  vehicle_model: Joi.string().max(50).allow(null, ''),
  phone_number: Joi.string().max(20),
  base_fare: Joi.number().integer().min(0).allow(null),
  is_available: Joi.boolean(),
  is_verified: Joi.boolean()
}).min(1); // At least one field must be updated

// ================= Auto Schemas =================
const autoPostSchema = Joi.object({
  driver_name: Joi.string().max(100).required(),
  vehicle_number: Joi.string().max(20).required(),
  phone_number: Joi.string().max(20).required(),
  base_fare: Joi.number().integer().min(0).allow(null),
  is_available: Joi.boolean().default(true),
  is_verified: Joi.boolean().default(false)
});

const autoPutSchema = Joi.object({
  driver_name: Joi.string().max(100),
  vehicle_number: Joi.string().max(20),
  phone_number: Joi.string().max(20),
  base_fare: Joi.number().integer().min(0).allow(null),
  is_available: Joi.boolean(),
  is_verified: Joi.boolean()
}).min(1);

// ================= Laundry Schemas =================
const laundryPostSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow(null, ''),
  location: Joi.string().max(255).required(),
  price_per_kg: Joi.number().integer().min(0).allow(null),
  phone_number: Joi.string().max(20).required(),
  opening_time: Joi.string().pattern(timeRegex).allow(null, ''),
  closing_time: Joi.string().pattern(timeRegex).allow(null, ''),
  is_open: Joi.boolean().default(true),
  is_verified: Joi.boolean().default(false),
  logo_url: Joi.string().uri().allow(null, '')
});

const laundryPutSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().allow(null, ''),
  location: Joi.string().max(255),
  price_per_kg: Joi.number().integer().min(0).allow(null),
  phone_number: Joi.string().max(20),
  opening_time: Joi.string().pattern(timeRegex).allow(null, ''),
  closing_time: Joi.string().pattern(timeRegex).allow(null, ''),
  is_open: Joi.boolean(),
  is_verified: Joi.boolean(),
  logo_url: Joi.string().uri().allow(null, '')
}).min(1);

// ================= Restaurant Schemas =================
const restaurantPostSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow(null, ''),
  disclaimer: Joi.string().allow(null, ''),
  location: Joi.string().max(255).required(),
  phone_number: Joi.string().max(20).required(),
  logo_url: Joi.string().uri().allow(null, ''),
  menu_images: Joi.array().items(Joi.string().uri()).allow(null),
  opening_time: Joi.string().pattern(timeRegex).allow(null, ''),
  closing_time: Joi.string().pattern(timeRegex).allow(null, ''),
  is_open: Joi.boolean().default(true),
  is_verified: Joi.boolean().default(false),
  average_cost_for_one: Joi.number().integer().min(0).allow(null)
});

const restaurantPutSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().allow(null, ''),
  disclaimer: Joi.string().allow(null, ''),
  location: Joi.string().max(255),
  phone_number: Joi.string().max(20),
  logo_url: Joi.string().uri().allow(null, ''),
  menu_images: Joi.array().items(Joi.string().uri()).allow(null),
  opening_time: Joi.string().pattern(timeRegex).allow(null, ''),
  closing_time: Joi.string().pattern(timeRegex).allow(null, ''),
  is_open: Joi.boolean(),
  is_verified: Joi.boolean(),
  average_cost_for_one: Joi.number().integer().min(0).allow(null)
}).min(1);

// ================= Salon Schemas =================
const salonPostSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().allow(null, ''),
  location: Joi.string().max(255).required(),
  haircut_price: Joi.number().integer().min(0).required(),
  beard_price: Joi.number().integer().min(0).required(),
  phone_number: Joi.string().max(20).required(),
  opening_time: Joi.string().pattern(timeRegex).allow(null, ''),
  closing_time: Joi.string().pattern(timeRegex).allow(null, ''),
  is_open: Joi.boolean().default(true),
  is_verified: Joi.boolean().default(false),
  logo_url: Joi.string().uri().allow(null, '')
});

const salonPutSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().allow(null, ''),
  location: Joi.string().max(255),
  haircut_price: Joi.number().integer().min(0),
  beard_price: Joi.number().integer().min(0),
  phone_number: Joi.string().max(20),
  opening_time: Joi.string().pattern(timeRegex).allow(null, ''),
  closing_time: Joi.string().pattern(timeRegex).allow(null, ''),
  is_open: Joi.boolean(),
  is_verified: Joi.boolean(),
  logo_url: Joi.string().uri().allow(null, '')
}).min(1);

module.exports = {
  cabPostSchema,
  cabPutSchema,
  autoPostSchema,
  autoPutSchema,
  laundryPostSchema,
  laundryPutSchema,
  restaurantPostSchema,
  restaurantPutSchema,
  salonPostSchema,
  salonPutSchema
};
