const express = require('express');
const router = express.Router();
const salonController = require('../controllers/salonController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { salonPostSchema, salonPutSchema } = require('../utils/schemas');

router.get('/', salonController.getAllSalons);
router.get('/:id', salonController.getSalonById);
router.post('/', adminMiddleware, validate(salonPostSchema), salonController.createSalon);
router.put('/:id', adminMiddleware, validate(salonPutSchema), salonController.updateSalon);
router.delete('/:id', adminMiddleware, salonController.deleteSalon);

module.exports = router;
