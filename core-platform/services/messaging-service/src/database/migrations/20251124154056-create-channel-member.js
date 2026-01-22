'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ChannelMembers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channelId: {
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      joinedAt: {
        type: Sequelize.DATE
      },
      lastReadAt: {
        type: Sequelize.DATE
      },
      notificationPreference: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ChannelMembers');
  }
};