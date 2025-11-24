'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageReaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // MessageReaction belongs to a Message
      MessageReaction.belongsTo(models.Message, { foreignKey: 'messageId', as: 'message' });
    }
  }
  MessageReaction.init({
    messageId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    emoji: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MessageReaction',
  });
  return MessageReaction;
};