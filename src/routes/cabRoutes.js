const express = require('express');
const router = express.Router();
const cabController = require('../controllers/cabController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { cabPostSchema, cabPutSchema } = require('../utils/schemas');

router.get('/', cabController.getAllCabs);
router.get('/:id', cabController.getCabById);
router.post('/', adminMiddleware, validate(cabPostSchema), cabController.createCab);
router.put('/:id', adminMiddleware, validate(cabPutSchema), cabController.updateCab);
router.delete('/:id', adminMiddleware, cabController.deleteCab);

module.exports = router;
