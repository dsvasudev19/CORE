const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const {extractUserContext} = require('../middleware/userContext');

// Use user context middleware instead of JWT authentication
router.use(extractUserContext);

router.get('/channel/:channelId', messageController.getChannelMessages);
router.get('/:messageId', messageController.getMessageById);
router.get('/thread/:threadId', messageController.getThreadMessages);
router.post('/search', messageController.searchMessages);

module.exports = router;
