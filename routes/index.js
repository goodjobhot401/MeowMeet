const express = require('express')
const router = express.Router()
const { generalErrorHandler, apiErrorHandler } = require('../middleware/error-handler')
const { authenticator, authenticatedAdmin } = require('../middleware/auth')
const passport = require('passport')

const userController = require('../controllers/user-controller')
const meowController = require('../controllers/meow-controller')

const users = require('./modules/users')
const meows = require('./modules/meows')
const admin = require('./modules/admin')
const api = require('./modules/api')

router.use('/admin', authenticatedAdmin, admin)
router.use('/api', api)
router.use('/users', authenticator, users)
router.use('/meows', meows)

// 搜尋街貓頁
router.get('/search', meowController.searchMeows)

// 登入頁
router.get('/signin', userController.signInPage)

// 登入
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// 註冊頁
router.get('/signup', userController.signUpPage)

// 註冊
router.post('/signup', userController.signUp)

// 登出
router.get('/logout', userController.logout)

// 轉至搜尋頁
router.get('/', (req, res, next) => {
  req.flash('success_messages', '搜尋「松山火車站」開始您的探險吧')
  res.redirect('/search')
})

// 錯誤處理
router.use('/api', apiErrorHandler)
router.use('/', generalErrorHandler)

module.exports = router
