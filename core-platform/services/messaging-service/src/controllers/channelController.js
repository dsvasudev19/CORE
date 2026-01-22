const { Channel, ChannelMember, sequelize } = require('../models');
const logger = require('../utils/logger');
const { fetchTeamMembers } = require('../services/externalServices');
const { Op } = require('sequelize');

exports.createChannel = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, type, teamId, memberIds } = req.body;
    const userId = req.user.userId;
    const userName = req.user.userName;

    // Create the channel
    const channel = await Channel.create({
      name,
      description,
      type: type || 'public',
      teamId,
      createdBy: userId,
      lastMessageAt: new Date()
    }, { transaction });

    // Prepare members list (creator is always admin)
    const membersToAdd = [];

    // Add creator
    membersToAdd.push({
      channelId: channel.id,
      userId: userId,
      role: 'admin',
      joinedAt: new Date(),
      notificationPreference: 'all'
    });

    // Fetch and add other members if provided
    if (memberIds && memberIds.length > 0) {
      // Filter out creator if present in memberIds to avoid duplicate
      const otherMemberIds = memberIds.filter(id => id !== userId);

      if (otherMemberIds.length > 0) {
        const teamMembers = await fetchTeamMembers(teamId, otherMemberIds);

        teamMembers.forEach(member => {
          membersToAdd.push({
            channelId: channel.id,
            userId: member.userId,
            role: 'member',
            joinedAt: new Date(),
            notificationPreference: 'all'
          });
        });
      }
    }

    // Bulk create members
    await ChannelMember.bulkCreate(membersToAdd, { transaction });

    await transaction.commit();

    // Fetch the created channel with members
    const createdChannel = await Channel.findByPk(channel.id, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    res.status(201).json({ channel: createdChannel });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error creating channel:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
};

exports.getTeamChannels = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { includeArchived } = req.query;
    const userId = req.user.userId;

    const whereClause = {
      teamId
    };

    if (includeArchived !== 'true') {
      whereClause.isArchived = false;
    }

    // Find channels where user is a member
    const channels = await Channel.findAll({
      where: whereClause,
      include: [{
        model: ChannelMember,
        as: 'members',
        where: { userId },
        required: true // Inner join to ensure user is member
      }],
      order: [['lastMessageAt', 'DESC']]
    });

    res.json({ channels });
  } catch (error) {
    logger.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is member
    const isMember = channel.members.some(m => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ channel });
  } catch (error) {
    logger.error('Error fetching channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
};

exports.updateChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is admin
    const member = channel.members.find(m => m.userId === userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (name) channel.name = name;
    if (description !== undefined) channel.description = description;

    await channel.save();

    res.json({ channel });
  } catch (error) {
    logger.error('Error updating channel:', error);
    res.status(500).json({ error: 'Failed to update channel' });
  }
};

exports.deleteChannel = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is admin
    const member = channel.members.find(m => m.userId === userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Delete members first (or rely on cascade if configured, but explicit is safer here without cascade setup)
    await ChannelMember.destroy({
      where: { channelId },
      transaction
    });

    await channel.destroy({ transaction });

    await transaction.commit();

    res.json({ message: 'Channel deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error('Error deleting channel:', error);
    res.status(500).json({ error: 'Failed to delete channel' });
  }
};

exports.addMembers = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { memberIds } = req.body;
    const userId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is admin
    const member = channel.members.find(m => m.userId === userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Filter out existing members
    const existingMemberIds = channel.members.map(m => m.userId);
    const newMemberIds = memberIds.filter(id => !existingMemberIds.includes(id));

    if (newMemberIds.length > 0) {
      const teamMembers = await fetchTeamMembers(channel.teamId, newMemberIds);

      const membersToAdd = teamMembers.map(tm => ({
        channelId: channel.id,
        userId: tm.userId,
        role: 'member',
        joinedAt: new Date(),
        notificationPreference: 'all'
      }));

      await ChannelMember.bulkCreate(membersToAdd);
    }

    // Fetch updated channel
    const updatedChannel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    res.json({ channel: updatedChannel });
  } catch (error) {
    logger.error('Error adding members:', error);
    res.status(500).json({ error: 'Failed to add members' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { channelId, userId: targetUserId } = req.params;
    const requestingUserId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is admin or removing themselves
    const requester = channel.members.find(m => m.userId === requestingUserId);

    if (requestingUserId !== targetUserId) {
      if (!requester || requester.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }

    await ChannelMember.destroy({
      where: {
        channelId,
        userId: targetUserId
      }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    logger.error('Error removing member:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

exports.archiveChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is admin
    const member = channel.members.find(m => m.userId === userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    channel.isArchived = true;
    await channel.save();

    res.json({ channel });
  } catch (error) {
    logger.error('Error archiving channel:', error);
    res.status(500).json({ error: 'Failed to archive channel' });
  }
};

exports.unarchiveChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user.userId;

    const channel = await Channel.findByPk(channelId, {
      include: [{
        model: ChannelMember,
        as: 'members'
      }]
    });

    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    // Verify user is admin
    const member = channel.members.find(m => m.userId === userId);
    if (!member || member.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    channel.isArchived = false;
    await channel.save();

    res.json({ channel });
  } catch (error) {
    logger.error('Error unarchiving channel:', error);
    res.status(500).json({ error: 'Failed to unarchive channel' });
  }
};

exports.getDirectChannel = async (req, res) => {
  try {
    const { userId: targetUserId } = req.params;
    const currentUserId = req.user.userId;

    // Check if DM channel already exists
    // This is a bit complex in SQL: find a channel of type 'direct' where both users are members
    // We can find channels where current user is member, then filter for target user

    const channels = await Channel.findAll({
      where: { type: 'direct' },
      include: [{
        model: ChannelMember,
        as: 'members',
        where: {
          userId: {
            [Op.in]: [currentUserId, targetUserId]
          }
        }
      }]
    });

    // Filter in memory to find the one with BOTH members
    const existingChannel = channels.find(c =>
      c.members.length === 2 &&
      c.members.some(m => m.userId === currentUserId) &&
      c.members.some(m => m.userId === targetUserId)
    );

    if (existingChannel) {
      return res.json({ channel: existingChannel });
    }

    // Create new DM channel
    const transaction = await sequelize.transaction();
    try {
      const channel = await Channel.create({
        name: `dm-${currentUserId}-${targetUserId}`, // Internal name
        type: 'direct',
        createdBy: currentUserId,
        lastMessageAt: new Date()
      }, { transaction });

      await ChannelMember.bulkCreate([
        {
          channelId: channel.id,
          userId: currentUserId,
          role: 'member',
          joinedAt: new Date(),
          notificationPreference: 'all'
        },
        {
          channelId: channel.id,
          userId: targetUserId,
          role: 'member',
          joinedAt: new Date(),
          notificationPreference: 'all'
        }
      ], { transaction });

      await transaction.commit();

      const newChannel = await Channel.findByPk(channel.id, {
        include: [{
          model: ChannelMember,
          as: 'members'
        }]
      });

      res.status(201).json({ channel: newChannel });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    logger.error('Error getting/creating DM channel:', error);
    res.status(500).json({ error: 'Failed to get/create DM channel' });
  }
};
