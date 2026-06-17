'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Argument: 'users' (Table name)
    // 2. Argument: 'refresh_token' (Column name)
    // 3. Argument: { type: ... } (Column definition object)
    await queryInterface.addColumn('users', 'refresh_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'refresh_token');
  },
};
