'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessageAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // MessageAttachment belongs to a Message
      MessageAttachment.belongsTo(models.Message, { foreignKey: 'messageId', as: 'message' });
    }
  }
  MessageAttachment.init({
    messageId: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    fileType: DataTypes.STRING,
    fileSize: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MessageAttachment',
  });
  return MessageAttachment;
};