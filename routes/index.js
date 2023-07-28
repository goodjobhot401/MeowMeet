const express = require('express')
const { generalErrorHandler, apiErrorHandler } = require('../middleware/error-handler')
const { authenticator, authenticatedAdmin } = require('../middleware/auth')
const router = express.Router()
const passport = require('passport')
const upload = require('../middleware/multer')

const apiController = require('../controllers/api-controller')
const userController = require('../controllers/user-controller')
const meowController = require('../controllers/meow-controller')
const adminController = require('../controllers/admin-controller')


// 使用 google map api 金鑰
router.get('/api/googleApi', apiController.getGoogleApi)

// 接收 google map viewport 並回傳 viewport 範圍內的資料
router.post('/api/markerData', apiController.postViewport)

// 後台 meow 管理頁
router.get('/admin/meows', adminController.getMeows)

// 後台 user 管理頁
router.get('/admin/users', adminController.getUsers)

// 上傳街貓頁
router.get('/users/meows/create', meowController.creatMeow)

// 上傳街貓
router.post('/users/meows', upload.single('avatar'), meowController.postMeow)

// 登入頁
router.get('/signin', userController.signInPage)

// 登入
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// 登出
router.get('/logout', userController.logout)

// 註冊頁
router.get('/signup', userController.signUpPage)

// 註冊
router.post('/signup', userController.signUp)

// 搜尋街貓頁
router.get('/search', meowController.searchMeows)

// 街貓檔案頁
router.get('/meows/:id', meowController.getMeow)

// 錯誤處理
router.use('/api', apiErrorHandler)
router.use('/', generalErrorHandler)

module.exports = router
