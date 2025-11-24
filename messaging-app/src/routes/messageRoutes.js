const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/channel/:channelId', messageController.getChannelMessages);
router.get('/:messageId', messageController.getMessageById);
router.get('/thread/:threadId', messageController.getThreadMessages);
router.post('/search', messageController.searchMessages);

module.exports = router;
