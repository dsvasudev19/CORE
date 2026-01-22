'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Message belongs to a Channel
      Message.belongsTo(models.Channel, { foreignKey: 'channelId', as: 'channel' });
      // Message can have many reactions, mentions, attachments, and child messages (threads)
      Message.hasMany(models.MessageReaction, { foreignKey: 'messageId', as: 'reactions' });
      Message.hasMany(models.MessageMention, { foreignKey: 'messageId', as: 'mentions' });
      Message.hasMany(models.MessageAttachment, { foreignKey: 'messageId', as: 'attachments' });
      Message.hasMany(models.Message, { foreignKey: 'parentMessageId', as: 'replies' });
    }
  }
  Message.init({
    channelId: DataTypes.INTEGER,
    senderId: DataTypes.STRING,
    senderName: DataTypes.STRING,
    senderAvatar: DataTypes.STRING,
    content: DataTypes.TEXT,
    messageType: DataTypes.STRING,
    parentMessageId: DataTypes.INTEGER,
    threadReplyCount: DataTypes.INTEGER,
    isEdited: DataTypes.BOOLEAN,
    isDeleted: DataTypes.BOOLEAN,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};