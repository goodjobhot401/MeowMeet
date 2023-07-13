const express = require('express')
const router = express.Router()
const googleApi = require('../googleApi')

router.get('/api/googleApi', (req, res, next) => {
  const results = { googleApi }
  // console.log(results.googleApi.geocodingApiKey)
  return res.json(results)
})

router.get('/users/meows/create', (req, res, next) => {
  res.render('meow-create')
})

router.get('/', (req, res) => {
  res.render('search')
})

module.exports = router
