const { Meow, Reply, Like } = require('../models')
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
  createMeow: async (req, res, next) => {
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
      const loginUserId = req.user.id
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
        userId: loginUserId,
        avatar: filePath || null
      })
      req.flash('success_messages', '成功新增街貓檔案')
      return res.redirect('/search')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 取得街貓檔案
  getMeow: async (req, res, next) => {
    try {
      const loginUser = req.user
      const meowId = req.params.meowId

      const [meow, like] = await Promise.all([
        Meow.findByPk(meowId, {
          raw: true,
          nest: true,
          where: { id: meowId }
        }),
        Like.findOne({
          where: {
            userId: loginUser.id,
            meowId
          }
        })
      ])

      const meowData = {
        ...meow,
        isLiked: like ? true : false
      }

      console.log(meowData)
      res.render('meow', { loginUser, meow: meowData })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 新增街貓檔案留言
  postReply: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const meowId = req.params.meowId
      const { comment } = req.body

      if (!comment || comment.trim() === '') throw new Error('內容不可空白')
      if (comment.length > 150) throw new Error('字數不可超過 150 字')

      const reply = await Reply.create({
        comment,
        userId: loginUserId,
        meowId
      })

      req.flash('success_messages', '回復成功')
      res.redirect(`/meows/${meowId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 新增街貓檔案給讚
  postLike: async (req, res, next) => {
    try {
      const loginUser = req.user.id
      const meowId = req.params.meowId
      const [meow, like] = await Promise.all([
        Meow.findByPk(meowId),
        Like.findOne({
          where: {
            userId: loginUser,
            meowId
          }
        })
      ])

      if (!meow) throw new Error('街貓不存在')
      if (like) throw new Error('您已按讚！')

      await Like.create({
        userId: loginUser,
        meowId
      })

      res.redirect('back')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

}

module.exports = meowController
