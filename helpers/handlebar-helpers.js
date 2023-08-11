const dayjs = require('./dayjs-helper')
const relativeTime = require('dayjs/plugin/relativeTime')

// 使用擴充
// dayjs.extend(updateLocale)
dayjs.extend(relativeTime)

module.exports = {
  ifCond: function (a, b, options) {
    return a === b ? options.fn(this) : options.inverse(this)
  },

  // 依據回傳資料判定輸出 icon 數量
  generateIcons: function (number) {
    let icons = ''
    for (let i = 0; i < number; i++) {
      icons += '<i class="fa-brands fa-gratipay me-1" style="color: #59f487;"></i>'
    }
    return icons
  },

  // 依據回傳資料判定輸出 icon
  genderIcon: function (gender) {
    switch (gender) {
      case 'male':
        return '<i class="fa-solid fa-mars" style="color: #1e3150;"></i>'
      case 'female':
        return '<i class="fa-solid fa-venus" style="color: #ff5290;"></i>'
      case 'unknown':
        return '<i class="fa-regular fa-circle-question" style="color: #787878;"></i>'
    }
  },

  // 依據回傳資料判定輸出 icon
  neuterIcon: function (neuter) {
    switch (neuter) {
      case 'neutered':
        return '<i class="fa-solid fa-neuter" style="color: #1e3150;"></i>'
      case 'unNeutered':
        return '<i class="fa-regular fa-circle-xmark" style="color: #1e3150;"></i>'
      case 'unknown':
        return '<i class="fa-regular fa-circle-question" style="color: #787878;"></i>'
    }
  },

  // 人性化時間顯示：ex. 16 hours age
  relativeTime: function (a) {
    return dayjs(a).fromNow()
  }
}
