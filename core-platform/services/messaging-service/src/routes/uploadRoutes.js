const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', uploadController.uploadFile);

module.exports = router;
