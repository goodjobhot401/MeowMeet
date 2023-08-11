const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// 後台 meow 管理頁
router.get('/meows', adminController.getMeows)

// 後台 user 管理頁
router.get('/users', adminController.getUsers)

module.exports = router
