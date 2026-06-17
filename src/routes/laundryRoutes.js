const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundryController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { laundryPostSchema, laundryPutSchema } = require('../utils/schemas');

router.get('/', laundryController.getAllLaundries);
router.get('/:id', laundryController.getLaundryById);
router.post('/', adminMiddleware, validate(laundryPostSchema), laundryController.createLaundry);
router.put('/:id', adminMiddleware, validate(laundryPutSchema), laundryController.updateLaundry);
router.delete('/:id', adminMiddleware, laundryController.deleteLaundry);

module.exports = router;
