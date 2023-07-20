const express = require('express')
const router = express.Router()
const googleApi = require('../googleApi')
const upload = require('../middleware/multer')

// const userController = require('../controllers/user-controller')
const meowController = require('../controllers/meow-controller')

router.get('/api/googleApi', (req, res, next) => {
  const results = { googleApi }
  return res.json(results)
})

router.get('/users/meows/create', meowController.creatMeow)

router.post('/users/meows', upload.single('avatar'), meowController.postMeow)

router.get('/search', meowController.searchMeows)

module.exports = router
