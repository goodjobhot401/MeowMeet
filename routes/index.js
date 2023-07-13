const express = require('express')
const router = express.Router()
const googleApi = require('../googleApi')

router.get('/', (req, res) => {
  res.render('search')
})

router.get('/api/googleApi', (req, res, next) => {
  const results = { googleApi }
  // console.log(results.googleApi.geocodingApiKey)
  return res.json(results)
})

module.exports = router
