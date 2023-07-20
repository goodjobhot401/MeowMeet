const { Meow } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const meowController = {
  // 搜尋首頁
  searchMeows: async (req, res, next) => {
    try {
      res.render('search')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 新增街貓頁面
  creatMeow: async (req, res, next) => {
    try {
      res.render('meow-create')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 新增街貓檔案
  postMeow: async (req, res, next) => {
    try {
      const { name, gender, neuter, friendly, color, age, intro, latitude, longitude, location } = req.body

      const { file } = req
      // 將取出的檔案交給 file-helpers.js 處理
      const filePath = await imgurFileHandler(file)
      const newMeow = await Meow.create({
        name,
        gender,
        neuter,
        friendly: Number(friendly),
        color,
        age,
        intro,
        latitude: Number(latitude),
        longitude: Number(longitude),
        location,
        avatar: filePath || null
      })
      return res.redirect('/search')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

}

module.exports = meowController
