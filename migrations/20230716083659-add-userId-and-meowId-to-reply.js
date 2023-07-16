'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Replies', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    })

    await queryInterface.addColumn('Replies', 'meowId', {
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
    await queryInterface.removeColumn('Replies', 'userId')
    await queryInterface.removeColumn('Replies', 'meowId')

    return Promise.resolve()
  }
}
