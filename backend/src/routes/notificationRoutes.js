const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const adminMiddleware = require('../middleware/adminMiddleware');
const validate = require('../middleware/validationMiddleware');
const { notificationPostSchema } = require('../utils/schemas');

router.get('/', notificationController.getAllNotifications);
router.post('/', adminMiddleware, validate(notificationPostSchema), notificationController.createNotification);
router.delete('/:id', adminMiddleware, notificationController.deleteNotification);

module.exports = router;
