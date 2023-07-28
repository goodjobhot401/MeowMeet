const adminController = {
  // 取得 meows 清單
  getMeows: (req, res, next) => {
    res.render('admin/admin-meows', { admin: true })
  },

  // 取得 users 清單
  getUsers: (req, res, next) => {
    res.render('admin/admin-users', { admin: true })
  }
}

module.exports = adminController
