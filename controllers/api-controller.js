const { Meow, meowImage } = require('../models')
const { Op } = require('sequelize')
const googleApi = require('../googleApi')

const apiController = {
  // 取得 google map api 金鑰
  getGoogleApi: (req, res, next) => {
    const results = { googleApi }
    return res.json(results)
  },

  // 取得 viewport 內的街貓資料
  postViewport: async (req, res, next) => {
    try {
      const { viewport } = req.body

      // 取出 viewport 東西南北座標
      const southwestLat = parseFloat(viewport.southwest.lat.toFixed(6))
      const southwestLng = parseFloat(viewport.southwest.lng.toFixed(6))
      const northeastLat = parseFloat(viewport.northeast.lat.toFixed(6))
      const northeastLng = parseFloat(viewport.northeast.lng.toFixed(6))

      // 查詢 viewport 範圍內的街貓資料
      const markerData = await Meow.findAll({
        raw: true,
        nest: true,
        attributes: ['id', 'name', 'avatar', 'gender', 'latitude', 'longitude', 'friendly', 'intro'],
        where: {
          latitude: {
            [Op.between]: [southwestLat, northeastLat]
          },
          longitude: {
            [Op.between]: [southwestLng, northeastLng]
          }
        }
      })
      res.json(markerData)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 刪除街貓檔案確認 modal
  getMeow: async (req, res, next) => {
    try {
      const meowId = req.params.meowId
      // console.log('meowId 的號碼是:' + meowId)

      const meow = await Meow.findOne({
        where: { id: meowId },
        include: [{ model: meowImage, raw: true, nest: true }],
        attributes: ['id', 'name', 'avatar'],
        raw: true,
        nest: true
      })

      // console.log('meow 的檔案:' + JSON.stringify(meow))
      return res.json(meow)
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 刪除街貓照片確認 modal
  getMeowImage: async (req, res, next) => {
    try {
      const imageId = req.params.imageId
      // console.log('imageId 的號碼是:' + imageId)

      const image = await meowImage.findOne({
        where: { id: imageId },
        include: [{ model: Meow, attributes: ['name'] }],
        raw: true,
        nest: true
      })
      // console.log('image的回傳檔案如下' + JSON.stringify(image))
      return res.json(image)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = apiController
