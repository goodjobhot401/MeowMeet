const passport = require('passport')
const LocalStragety = require('passport-local').Strategy
const bycrpt = require('bcryptjs')
const { User } = require('../models')

// passport 本地登入策略
passport.use('local', new LocalStragety(
  // 客製 user 欄位
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },

  // 驗證 user
  (req, email, password, cb) => {
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) return cb(null, false, req.flash('error_messages', '信箱不存在！'))
        return bycrpt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              return cb(null, false, req.flash('error_messages', '密碼不存在！'))
            }
            return cb(null, user)
          })
      })
      .catch(err => cb(err))
  }
))

// 正序列化、反序列化
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  return User.findByPk(id)
    .then(user => cb(null, user.toJSON()))
    .catch(err => cb(err))
})

module.exports = passport
