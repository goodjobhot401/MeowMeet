const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const { authenticator } = require('../../middleware/auth')
const meowController = require('../../controllers/meow-controller')

// 上傳街貓頁
router.get('/create', authenticator, meowController.createMeow)

// 上傳街貓檔案
router.post('/create', authenticator, upload.single('avatar'), meowController.postMeow)

// 我的街貓頁
router.get('/:id/myMeows', authenticator, meowController.getMyMeows)

// 刪除街貓檔案
router.delete('/:meowId', authenticator, meowController.deleteMeow)

// 街貓檔案頁
router.get('/:meowId', meowController.getMeow)

// 街貓檔案編輯頁
router.get('/:meowId/edit', authenticator, meowController.getMeowEdit)

// 送出街貓檔案編輯
router.put('/:meowId/edit', authenticator, upload.single('avatar'), meowController.putMeowEdit)

// 新增街貓檔案留言
router.post('/:meowId/replies', authenticator, meowController.postReply)

// 新增街貓檔案讚
router.post('/:meowId/like', authenticator, meowController.postLike)

// 收回街貓檔案讚
router.post('/:meowId/unlike', authenticator, meowController.postUnlike)

// 上傳街貓照片
// router.post('/:meowId/image', authenticator, upload.single('meowImage'), meowController.postMeowImage)

// 上傳多張街貓照片
router.post('/:meowId/image', authenticator, upload.array('meowImage', 5), meowController.postMeowImages)

// 刪除街貓照片
router.delete('/:imageId/image', authenticator, meowController.deleteMeowImage)

module.exports = router
