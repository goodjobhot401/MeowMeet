'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query('SELECT * FROM users;', { type: Sequelize.QueryTypes.SELECT })
    await queryInterface.bulkInsert('meows', [
      {
        name: '虎克',
        avatar: 'https://i.imgur.com/MQBBF11.jpeg',
        gender: 'male',
        color: '白底虎班',
        neuter: 'neutered',
        age: '6歲',
        friendly: 5,
        location: '松山火車站',
        latitude: 25.049092,
        longitude: 121.577693,
        intro: '胖胖可愛',
        user_id: users[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '咪寶',
        avatar: 'https://i.imgur.com/sdja060.jpeg',
        gender: 'male',
        color: '橘貓',
        neuter: 'neutered',
        age: '5歲',
        friendly: 4,
        location: '松山火車站',
        latitude: 25.049520,
        longitude: 121.576084,
        intro: '有虎媽的咪寶',
        user_id: users[1].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '麵粉',
        avatar: 'https://i.imgur.com/E5XY4LD.jpeg',
        gender: 'male',
        color: '灰底虎班',
        neuter: 'neutered',
        age: '6歲',
        friendly: 3,
        location: '松山火車站',
        latitude: 25.050472,
        longitude: 121.578444,
        intro: '會出爪!! 有時候蠻兇',
        user_id: users[2].id,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: '兔比比',
        avatar: 'https://i.imgur.com/G4Qpfq7.jpeg',
        gender: 'female',
        color: '白底虎班',
        neuter: 'neutered',
        age: '5歲',
        friendly: 2,
        location: '松山火車站',
        latitude: 25.050978,
        longitude: 121.576277,
        intro: '看到陌生人會躲起來',
        user_id: users[2].id,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('meows', {})
  }
}
