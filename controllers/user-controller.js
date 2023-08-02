const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  // 登入頁
  signInPage: (req, res, next) => {
    try {
      res.render('signin', { closeColumn: true })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 註冊頁
  signUpPage: (req, res, next) => {
    try {
      res.render('signup', { closeColumn: true })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 送出登入請求
  signIn: (req, res, next) => {
    req.flash('success_messages', '已成功登入')
    res.redirect('/search')
  },

  // 送出註冊請求
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      if (!account || !name || !email || !password || !checkPassword) {
        req.flash('error_messages', '所有欄位都是必填的')
        return res.render('signup', {
          account,
          name,
          email,
          password,
          checkPassword,
          notUser: true
        })
      }

      if (password !== checkPassword) {
        req.flash('error_messages', '密碼與確認密碼不相同')
        return res.render('signup', {
          account,
          name,
          email,
          password,
          checkPassword,
          notUser: true
        })
      }

      const [sameAccount, sameEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])

      if (sameEmail) {
        req.flash('error_messages', 'email 已重複註冊！')
        return res.render('signup', {
          account,
          name,
          email,
          password,
          checkPassword,
          notUser: true
        })
      }
      if (sameAccount) {
        req.flash('error_messages', 'account 已重複註冊！')
        return res.render('signup', {
          account,
          name,
          email,
          password,
          checkPassword,
          notUser: true
        })
      }

      const hash = await bcrypt.hash(password, 10)
      await User.create({
        account,
        name,
        email,
        password: hash
      })

      req.flash('success_messages', '已成功註冊帳號')
      res.redirect('/signin')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 送出登出請求
  logout: (req, res, next) => {
    req.logout()
    req.flash('success_messages', '已成功登出')
    res.redirect('/search')
  }
}

module.exports = userController
