'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChannelMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A ChannelMember belongs to a Channel
      ChannelMember.belongsTo(models.Channel, { foreignKey: 'channelId', as: 'channel' });
    }
  }
  ChannelMember.init({
    channelId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    role: DataTypes.STRING,
    joinedAt: DataTypes.DATE,
    lastReadAt: DataTypes.DATE,
    notificationPreference: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ChannelMember',
  });
  return ChannelMember;
};