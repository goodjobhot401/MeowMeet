'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        name: 'user0',
        account: 'user0',
        email: 'user0@example.com',
        password: await bcrypt.hash('12345678', 10),
        avatar: 'https://i.imgur.com/eToBLxK.png',
        role: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user1',
        account: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('12345678', 10),
        avatar: 'https://i.imgur.com/eToBLxK.png',
        role: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'user2',
        account: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('12345678', 10),
        avatar: 'https://i.imgur.com/eToBLxK.png',
        role: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {})
  }
}
