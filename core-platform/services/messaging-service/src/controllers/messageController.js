const { Message, Channel, ChannelMember, MessageReaction, MessageMention, MessageAttachment, sequelize } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

exports.getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { limit = 50, before } = req.query;
    const userId = req.user.userId;

    // Verify user is member of channel
    const member = await ChannelMember.findOne({
      where: { channelId, userId }
    });

    if (!member) {
      return res.status(403).json({ error: 'Not authorized to view messages' });
    }

    const whereClause = {
      channelId,
      isDeleted: false,
      parentMessageId: null // Only fetch top-level messages, not thread replies
    };

    if (before) {
      whereClause.createdAt = { [Op.lt]: new Date(before) };
    }

    const messages = await Message.findAll({
      where: whereClause,
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: MessageReaction,
          as: 'reactions'
        },
        {
          model: MessageAttachment,
          as: 'attachments'
        },
        {
          model: MessageMention,
          as: 'mentions'
        }
      ]
    });

    // Reverse to show oldest first in the UI (standard chat behavior)
    res.json({ messages: messages.reverse() });
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

exports.getMessageById = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findByPk(messageId, {
      include: [
        {
          model: MessageReaction,
          as: 'reactions'
        },
        {
          model: MessageAttachment,
          as: 'attachments'
        },
        {
          model: MessageMention,
          as: 'mentions'
        }
      ]
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify user is member of channel
    const member = await ChannelMember.findOne({
      where: { channelId: message.channelId, userId }
    });

    if (!member) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ message });
  } catch (error) {
    logger.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

exports.getThreadMessages = async (req, res) => {
  try {
    const { threadId } = req.params; // threadId is the parentMessageId
    const userId = req.user.userId;

    const parentMessage = await Message.findByPk(threadId);
    if (!parentMessage) {
      return res.status(404).json({ error: 'Thread not found' });
    }

    // Verify user is member of channel
    const member = await ChannelMember.findOne({
      where: { channelId: parentMessage.channelId, userId }
    });

    if (!member) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const messages = await Message.findAll({
      where: {
        parentMessageId: threadId,
        isDeleted: false
      },
      order: [['createdAt', 'ASC']],
      include: [
        {
          model: MessageReaction,
          as: 'reactions'
        },
        {
          model: MessageAttachment,
          as: 'attachments'
        },
        {
          model: MessageMention,
          as: 'mentions'
        }
      ]
    });

    res.json({ messages });
  } catch (error) {
    logger.error('Error fetching thread messages:', error);
    res.status(500).json({ error: 'Failed to fetch thread messages' });
  }
};

exports.searchMessages = async (req, res) => {
  try {
    const { query, channelId, fromDate, toDate } = req.body;
    const userId = req.user.userId;

    const searchCriteria = {
      content: { [Op.like]: `%${query}%` }, // Basic SQL LIKE search
      isDeleted: false
    };

    if (channelId) {
      // Verify user is member of channel
      const member = await ChannelMember.findOne({
        where: { channelId, userId }
      });

      if (!member) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      searchCriteria.channelId = channelId;
    } else {
      // Search only in channels user is member of
      const userChannels = await ChannelMember.findAll({
        where: { userId },
        attributes: ['channelId']
      });

      const channelIds = userChannels.map(uc => uc.channelId);
      searchCriteria.channelId = { [Op.in]: channelIds };
    }

    if (fromDate) {
      searchCriteria.createdAt = { [Op.gte]: new Date(fromDate) };
    }
    if (toDate) {
      searchCriteria.createdAt = {
        ...searchCriteria.createdAt,
        [Op.lte]: new Date(toDate)
      };
    }

    const messages = await Message.findAll({
      where: searchCriteria,
      order: [['createdAt', 'DESC']],
      limit: 100,
      include: [
        {
          model: Channel,
          as: 'channel',
          attributes: ['name']
        }
      ]
    });

    res.json({ messages });
  } catch (error) {
    logger.error('Error searching messages:', error);
    res.status(500).json({ error: 'Failed to search messages' });
  }
};
