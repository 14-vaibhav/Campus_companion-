const express = require('express');
const router = express.Router();
const autoController = require('../controllers/autoController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { autoPostSchema, autoPutSchema } = require('../utils/schemas');

router.get('/', autoController.getAllAutos);
router.get('/:id', autoController.getAutoById);
router.post('/', adminMiddleware, validate(autoPostSchema), autoController.createAuto);
router.put('/:id', adminMiddleware, validate(autoPutSchema), autoController.updateAuto);
router.delete('/:id', adminMiddleware, autoController.deleteAuto);

module.exports = router;
