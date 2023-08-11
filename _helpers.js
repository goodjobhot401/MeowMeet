// 是否通過認證
function ensureAuthenticated(req) {
  return req.isAuthenticated()
}

// 取得登入使用者
function getUser(req) {
  return req.user
}

module.exports = {
  ensureAuthenticated,
  getUser
}
