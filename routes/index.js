const express = require('express')
const router = express.Router()
const upload = require('../middleware/multer')

const userController = require('../controllers/user-controller')
const apiController = require('../controllers/api-controller')
const meowController = require('../controllers/meow-controller')
// const passport = require('passport')

// 使用 google map api 金鑰
router.get('/api/googleApi', apiController.getGoogleApi)

// 接收 google map viewport 並回傳 viewport 範圍內的資料
router.post('/api/markerData', apiController.postViewport)

// 上傳街貓頁
router.get('/users/meows/create', meowController.creatMeow)

// 上傳街貓
router.post('/users/meows', upload.single('avatar'), meowController.postMeow)

// 登入頁
router.get('/signin', userController.signInPage)

// 登入
// router.post('/signin', passport.authenticate('local', {failureRedirect: '/signin', failureFlash: true}), userController.signIn)

// 註冊頁
router.get('/signup', userController.signUpPage)

// 註冊
// router.post('/signup', userController.signUp)

// 搜尋街貓頁
router.get('/search', meowController.searchMeows)

// 街貓檔案頁
router.get('/meows/:id', meowController.getMeow)

module.exports = router
