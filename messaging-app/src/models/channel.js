'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Channel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A Channel has many ChannelMembers and Messages
      Channel.hasMany(models.ChannelMember, { foreignKey: 'channelId', as: 'members' });
      Channel.hasMany(models.Message, { foreignKey: 'channelId', as: 'messages' });
    }
  }
  Channel.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.STRING,
    teamId: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    isArchived: DataTypes.BOOLEAN,
    lastMessageAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Channel',
  });
  return Channel;
};