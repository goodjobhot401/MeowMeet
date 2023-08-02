const adminController = {
  // 取得 meows 清單
  getMeows: (req, res, next) => {
    res.render('admin/admin-meows', { closeRightColumn: true })
  },

  // 取得 users 清單
  getUsers: (req, res, next) => {
    res.render('admin/admin-users', { closeRightColumn: true })
  }
}

module.exports = adminController
