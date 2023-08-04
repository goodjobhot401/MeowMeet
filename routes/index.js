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

// 刪除街貓檔案確認 modal
router.get('/api/meows/:meowId', apiController.getMeow)

// 刪除街貓照片確認 modal
router.get('/api/meowImages/:imageId', apiController.getMeowImage)

// 後台 meow 管理頁
router.get('/admin/meows', adminController.getMeows)

// 後台 user 管理頁
router.get('/admin/users', adminController.getUsers)

// 上傳街貓頁
router.get('/users/meows/create', meowController.createMeow)

// 上傳街貓檔案
router.post('/users/meows', upload.single('avatar'), meowController.postMeow)

// 刪除街貓檔案
router.delete('/meows/:meowId', meowController.deleteMeow)

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
router.get('/meows/:meowId', meowController.getMeow)

// 街貓檔案編輯頁
router.get('/meows/:meowId/edit', meowController.getMeowEdit)

// 送出街貓檔案編輯
router.put('/meows/:meowId/edit', upload.single('avatar'), meowController.putMeowEdit)

// 新增街貓檔案留言
router.post('/meows/:meowId/replies', meowController.postReply)

// 新增街貓檔案讚
router.post('/meows/:meowId/like', meowController.postLike)

// 收回街貓檔案讚
router.post('/meows/:meowId/unlike', meowController.postUnlike)

// 上傳街貓照片
router.post('/meows/:meowId/image', upload.single('meowImage'), meowController.postMeowImage)

// 刪除街貓照片
router.delete('/meows/:imageId/image', meowController.deleteMeowImage)

// 我的街貓頁
router.get('/users/:id/meows', meowController.getMyMeows)

// 錯誤處理
router.use('/api', apiErrorHandler)
router.use('/', generalErrorHandler)

module.exports = router
