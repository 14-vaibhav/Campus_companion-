const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { restaurantPostSchema, restaurantPutSchema } = require('../utils/schemas');

router.get('/', restaurantController.getAllRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', adminMiddleware, validate(restaurantPostSchema), restaurantController.createRestaurant);
router.put('/:id', adminMiddleware, validate(restaurantPutSchema), restaurantController.updateRestaurant);
router.delete('/:id', adminMiddleware, restaurantController.deleteRestaurant);

module.exports = router;
