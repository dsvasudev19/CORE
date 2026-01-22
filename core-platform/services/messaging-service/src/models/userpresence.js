'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPresence extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPresence.init({
    userId: DataTypes.STRING,
    status: DataTypes.STRING,
    lastSeenAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserPresence',
  });
  return UserPresence;
};