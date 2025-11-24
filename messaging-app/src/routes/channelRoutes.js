const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channelController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/', channelController.createChannel);
router.get('/team/:teamId', channelController.getTeamChannels);
router.get('/:channelId', channelController.getChannelById);
router.put('/:channelId', channelController.updateChannel);
router.delete('/:channelId', channelController.deleteChannel);
router.post('/:channelId/members', channelController.addMembers);
router.delete('/:channelId/members/:userId', channelController.removeMember);
router.post('/:channelId/archive', channelController.archiveChannel);
router.post('/:channelId/unarchive', channelController.unarchiveChannel);
router.get('/direct/:userId', channelController.getDirectChannel);

module.exports = router;
