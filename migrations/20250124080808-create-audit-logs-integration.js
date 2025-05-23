'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("audit_logs_integration", {
      log_id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
      },
      id: {
        type: Sequelize.DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      integration_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      request_payload: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      response_payload: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    })

    await queryInterface.addConstraint("audit_logs_integration", {
      fields: ["log_id"],
      type: "foreign key",
      name: "fkey_logId_audit_log_integration",
      references: {
        table: "audit_logs",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("audit_logs_integration")
  },
}
