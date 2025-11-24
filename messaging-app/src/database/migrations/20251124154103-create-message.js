'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channelId: {
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.STRING
      },
      senderName: {
        type: Sequelize.STRING
      },
      senderAvatar: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      messageType: {
        type: Sequelize.STRING
      },
      parentMessageId: {
        type: Sequelize.INTEGER
      },
      threadReplyCount: {
        type: Sequelize.INTEGER
      },
      isEdited: {
        type: Sequelize.BOOLEAN
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
      },
      deletedAt: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Messages');
  }
};