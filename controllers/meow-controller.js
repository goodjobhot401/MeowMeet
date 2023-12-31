const { Meow, User, Reply, Like, meowImage, LikeOfReply } = require('../models')
const db = require('../models/index')
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

  // 刪除街貓檔案
  deleteMeow: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const meowId = req.params.meowId

      const meow = await Meow.findOne({
        where: { id: meowId, userId: loginUserId }
      })

      if (!meow) {
        req.flash('error_messages', '找不到要刪除的街貓檔案')
        res.redirect(`/meows/${loginUserId}/myMeows`)
        return
      }

      const destroyPromises = [
        LikeOfReply.destroy({
          where: {
            replyId: {
              [db.Sequelize.Op.in]: db.Sequelize.literal(
                `(SELECT id FROM Replies WHERE meow_id = ${meowId})`
              )
            }
          }
        }),
        Like.destroy({ where: { meowId } }),
        meowImage.destroy({ where: { meowId } }),
        Reply.destroy({ where: { meowId } }),
        meow.destroy()
      ]

      await Promise.all(destroyPromises)

      req.flash('success_messages', '街貓檔案刪除成功')
      res.redirect(`/meows/${loginUserId}/myMeows`)
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

      // 先依照 meowId 查詢個別資料 + 獲得的 like 與 reply
      // reply 與 meowImage 以最新的時間排序
      const meow = await Meow.findByPk(meowId, {
        include: [
          {
            model: User,
            attributes: ['name', 'account', 'avatar']
          },
          {
            model: Like,
            attributes: ['id', 'userId', 'meowId']
          },
          {
            model: Reply,
            include: [
              { model: User, attributes: ['name', 'account', 'avatar'], raw: true, nest: true },
              { model: LikeOfReply, raw: true, nest: true }
            ]
          },
          {
            model: meowImage,
            include: [{ model: User, attributes: ['name', 'account'], raw: true, nest: true }]
          }
        ],
        order: [
          [{ model: Reply }, 'createdAt', 'DESC'],
          [{ model: meowImage }, 'createdAt', 'DESC']
        ],
        nest: true
      })

      // 如果使用者有登入, 查詢是否對此 meowId 的貓按過讚
      // 並依結果改變 isLiked 狀態
      let meowIsLiked = false
      if (loginUser) {
        const like = await Like.findOne({
          where: {
            userId: loginUser.id,
            meowId
          },
          nest: true,
          raw: true
        })
        meowIsLiked = !!like
      }

      // 組裝 meowData
      const meowCount = meow.toJSON()
      const meowData = {
        ...meow.toJSON(),
        isLiked: meowIsLiked,
        likeCount: meowCount.Likes.length,
        imageCount: meowCount.meowImages.length + 1,
        replyCount: meowCount.Replies.length
      }

      // 組裝 reply
      const reply = [
        ...meow.toJSON().Replies
      ]

      let replyIsLiked = reply

      if (loginUser) {
        replyIsLiked = reply.map(replyObj => {
          const isLiked = replyObj.LikeOfReplies.some(likeOfReply => likeOfReply.user_id === loginUser.id)
          return { ...replyObj, isLiked }
        })
      }

      // 組裝 image
      const image = [
        ...meow.toJSON().meowImages
      ]

      res.render('meow', { loginUser, meow: meowData, reply: replyIsLiked, image })
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

      req.flash('success_messages', '留言成功')
      res.redirect(`/meows/${meowId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 新增街貓檔案給讚
  postLike: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const meowId = req.params.meowId
      const [meow, like] = await Promise.all([
        Meow.findByPk(meowId),
        Like.findOne({
          where: {
            userId: loginUserId,
            meowId
          }
        })
      ])

      if (!meow) throw new Error('街貓不存在')
      if (like) throw new Error('您已按讚！')

      await Like.create({
        userId: loginUserId,
        meowId
      })

      res.redirect(`/meows/${meowId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 收回接貓檔案的讚
  postUnlike: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const meowId = req.params.meowId

      const like = await Like.findOne({
        where: {
          userId: loginUserId,
          meowId
        }
      })

      if (!like) {
        throw new Error('您尚未按讚！')
      } else {
        like.destroy()
        res.redirect(`/meows/${meowId}`)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 新增街貓照片
  postMeowImage: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const meowId = req.params.meowId

      const { file } = req
      const filePath = await imgurFileHandler(file)
      console.log('完成上傳圖片的網址在這：' + filePath)

      const newMeowImage = await meowImage.create({
        userId: loginUserId,
        meowId,
        image: filePath
      })
      req.flash('success_messages', '成功上傳照片')
      return res.redirect(`/meows/${meowId}`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 刪除街貓照片
  deleteMeowImage: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const imageId = req.params.imageId

      const deleteImage = await meowImage.findOne({
        where: { id: imageId, userId: loginUserId }
      })

      if (deleteImage) {
        await deleteImage.destroy()
        req.flash('success_messages', '照片刪除成功')
      } else {
        req.flash('error_messages', '找不到要刪除的照片')
      }

      res.redirect(`/meows/${loginUserId}/myMeows`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 我的街貓頁
  getMyMeows: async (req, res, next) => {
    try {
      const loginUserId = req.user.id

      const user = await User.findByPk(loginUserId, {
        include: [
          {
            model: Meow,
            attributes: ['id', 'name', 'avatar']
          },
          {
            model: meowImage,
            attributes: ['id', 'image'],
            include: [{ model: Meow, attributes: ['id', 'name'], raw: true, nest: true }]
          }
        ],
        order: [
          [{ model: Meow }, 'createdAt', 'DESC'],
          [{ model: meowImage }, 'createdAt', 'DESC']
        ],
        nest: true
      })

      console.log(user.toJSON())
      const userData = user.toJSON()
      const meowData = userData.Meows || []
      const meowImageData = userData.meowImages || []

      res.render('my-meows', { closeRightColumn: true, meow: meowData, image: meowImageData })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 街貓檔案編輯頁
  getMeowEdit: async (req, res, next) => {
    try {
      const meowId = req.params.meowId

      const meowData = await Meow.findByPk(meowId, {
        nest: true
      })

      console.log(meowData.toJSON())
      res.render('meow-edit', { meow: meowData.toJSON() })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 修改街貓檔案
  putMeowEdit: async (req, res, next) => {
    try {
      const loginUserId = req.user.id
      const meowId = req.params.meowId

      const { name, gender, neuter, friendly, color, age, intro, latitude, longitude, location } = req.body

      const { file } = req
      const filePath = await imgurFileHandler(file)

      const meow = await Meow.findOne({
        where: { id: meowId }
      })

      if (meow) {
        await meow.update({
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
      }

      req.flash('success_messages', '成功編輯街貓檔案')
      res.redirect(`/meows/${loginUserId}/myMeows`)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

}

module.exports = meowController
