const helpers = require('../_helpers')

module.exports = {
  authenticator: (req, res, next) => {
    // use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    req.flash('warning_messages', '請先登入才能使用')
    res.redirect('/signin')
  },
  authenticatedAdmin: (req, res, next) => {
    // if (req.isAuthenticated)
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role === 1) return next()
      req.flash('warning_messages', '管理員權限不足')
      res.redirect('/search')
    } else {
      res.redirect('/signin')
    }
  }
}