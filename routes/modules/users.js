const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')

// 編輯個人資料頁
router.get('/:id/setting', userController.getSettingPage)

// 修改個人資料
router.put('/:id/setting', userController.putSetting)

// 更換個人頭貼
router.put('/:id/avatar', upload.single('avatar'), userController.postAvatar)

// 對留言按讚
router.post('/replies/:replyId/like', userController.postReplyLike)

// 對留言收回讚
router.post('/replies/:replyId/unlike', userController.postReplyUnlike)

module.exports = router
