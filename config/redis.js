// 如果環境名不是production就引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const RedisStore = require('connect-redis').default
const redis = require('redis')

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
})

redisClient.on('connect', function () {
  console.log('redis 連結成功')
})

redisClient.connect().catch(console.error)

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'MeowMeet:'
})

module.exports = redisStore
