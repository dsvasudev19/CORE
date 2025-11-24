'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageMention extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // MessageMention belongs to a Message
      MessageMention.belongsTo(models.Message, { foreignKey: 'messageId', as: 'message' });
    }
  }
  MessageMention.init({
    messageId: DataTypes.INTEGER,
    mentionedUserId: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'MessageMention',
  });
  return MessageMention;
};