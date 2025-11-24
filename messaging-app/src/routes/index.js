const express = require('express');
const router = express.Router();

const channelRoutes = require('./channelRoutes');
const messageRoutes = require('./messageRoutes');
const uploadRoutes = require('./uploadRoutes');

router.use('/channels', channelRoutes);
router.use('/messages', messageRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
