const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { restaurantPostSchema, restaurantPutSchema } = require('../utils/schemas');

/**
 * @openapi
 * tags:
 *   name: Restaurants
 *   description: Operations related to managing restaurant records.
 */

/**
 * @openapi
 * /api/restaurants:
 *   get:
 *     summary: Retrieve all restaurants
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter restaurants by location name (case-insensitive partial match)
 *       - in: query
 *         name: is_open
 *         schema:
 *           type: boolean
 *         description: Filter by open status (true/false)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Offset for starting index
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (alternative calculation for offset)
 *     responses:
 *       200:
 *         description: List of restaurants (flat array, or paginated object if limit/offset/page is used)
 */
router.get('/', restaurantController.getAllRestaurants);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', restaurantController.getRestaurantById);

/**
 * @openapi
 * /api/restaurants:
 *   post:
 *     summary: Create a new restaurant record
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *       - roleHeader: []
 *       - authHeaderSecret: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - phone_number
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               disclaimer:
 *                 type: string
 *               location:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               logo_url:
 *                 type: string
 *               menu_images:
 *                 type: array
 *                 items:
 *                   type: string
 *               opening_time:
 *                 type: string
 *                 example: "09:00:00"
 *               closing_time:
 *                 type: string
 *                 example: "22:00:00"
 *               is_open:
 *                 type: boolean
 *               is_verified:
 *                 type: boolean
 *               average_cost_for_one:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created restaurant details
 *       403:
 *         description: Forbidden admin access required
 */
router.post('/', adminMiddleware, validate(restaurantPostSchema), restaurantController.createRestaurant);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update an existing restaurant record
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *       - roleHeader: []
 *       - authHeaderSecret: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated restaurant details
 *       403:
 *         description: Forbidden admin access required
 *       404:
 *         description: Restaurant not found
 */
router.put('/:id', adminMiddleware, validate(restaurantPutSchema), restaurantController.updateRestaurant);

/**
 * @openapi
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant record
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *       - roleHeader: []
 *       - authHeaderSecret: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       403:
 *         description: Forbidden admin access required
 *       404:
 *         description: Restaurant not found
 */
router.delete('/:id', adminMiddleware, restaurantController.deleteRestaurant);

module.exports = router;
