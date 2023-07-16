'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Missings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      neuter: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.STRING
      },
      friendly: {
        type: Sequelize.INTEGER
      },
      location: {
        type: Sequelize.STRING
      },
      latitude: {
        type: Sequelize.DataTypes.DECIMAL(9, 6)
      },
      longitude: {
        type: Sequelize.DataTypes.DECIMAL(9, 6)
      },
      intro: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Missings')
  }
}
