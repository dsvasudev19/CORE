'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MessageAttachments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      messageId: {
        type: Sequelize.INTEGER
      },
      fileName: {
        type: Sequelize.STRING
      },
      fileUrl: {
        type: Sequelize.STRING
      },
      fileType: {
        type: Sequelize.STRING
      },
      fileSize: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('MessageAttachments');
  }
};