const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signInPage: (req, res, next) => {
    try {
      res.render('signin', { notUser: true })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  signUpPage: (req, res, next) => {
    try {
      res.render('signup', { notUser: true })
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      let errors = {}

      if (!account || !name || !email || !password || !checkPassword) {
        req.flash('error_messages', '所有欄位都是必填的')
        return res.render('signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }

      if (password !== checkPassword) {
        errors.checkPassword = '密碼與確認密碼不相同'
      }

      if (Object.keys(errors).length) {
        return res.render('signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }

      const [sameAccount, sameEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])

      if (sameEmail) {
        errors.email = 'email 已重複註冊！'
      }
      if (sameAccount) {
        errors.account = 'account 已重複註冊！'
      }
      if (Object.keys(errors).length) {
        return res.render('signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
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

  signIn: (req, res, next) => {
    req.flash('success_messages', '已成功登入')
    res.redirect('/search')
  },

  logout: (req, res, next) => {
    req.logout()
    req.flash('success_messages', '已成功登出')
    res.redirect('/search')
  }
}

module.exports = userController
