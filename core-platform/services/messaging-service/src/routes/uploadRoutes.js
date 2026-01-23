const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const {extractUserContext} = require('../middleware/userContext');

// Use user context middleware instead of JWT authentication
router.use(extractUserContext);

router.post('/', uploadController.uploadFile);

module.exports = router;
