'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Audits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      before: {
        type: Sequelize.TEXT, // Alterado de JSON para TEXT
        allowNull: false
      },
      after: {
        type: Sequelize.TEXT, // Alterado de JSON para TEXT
        allowNull: false
      },
      entity: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entityId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Audits');
  }
};
