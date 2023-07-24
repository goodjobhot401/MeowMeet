const { Meow } = require('../models')
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
      // console.log(markerData)
      res.json(markerData)
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = apiController
