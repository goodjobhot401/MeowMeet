'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Replies', 'user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })

    await queryInterface.addColumn('Replies', 'meow_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Meows',
        key: 'id'
      }
    })

    return Promise.resolve()
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Replies', 'user_id')
    await queryInterface.removeColumn('Replies', 'meow_id')

    return Promise.resolve()
  }
}
