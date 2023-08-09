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

module.exports = router
