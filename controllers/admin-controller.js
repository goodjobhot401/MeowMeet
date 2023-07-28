const adminController = {
  getMeows: (req, res, next) => {
    res.render('admin/admin-meows', { admin: true })
  },

  getUsers: (req, res, next) => {
    res.render('admin/admin-users', { admin: true })
  }
}

module.exports = adminController
