const express = require('express')
const router = express.Router()
const apiController = require('../../controllers/api-controller')

// 使用 google map api 金鑰
router.get('/googleApi', apiController.getGoogleApi)

// 接收 google map viewport 並回傳 viewport 範圍內的資料
router.post('/markerData', apiController.postViewport)

// 刪除街貓檔案確認 modal
router.get('/meows/:meowId', apiController.getMeow)

// 刪除街貓照片確認 modal
router.get('/meowImages/:imageId', apiController.getMeowImage)

module.exports = router
