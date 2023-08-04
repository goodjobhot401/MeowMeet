const { User } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位都是必填的')
      }

      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相同')
      }

      const [sameAccount, sameEmail] = await Promise.all([
        User.findOne({ where: { account } }),
        User.findOne({ where: { email } })
      ])

      if (sameEmail) {
        errors.push('email 已重複註冊')
      }
      if (sameAccount) {
        errors.push('account 已重複註冊')
      }

      if (errors.length) {
        return res.render('signup', { error_messages: errors, account, name, email, closeColumn: true })
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

  // 編輯個人資料頁
  getSettingPage: async (req, res, next) => {
    try {
      res.render('setting')
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 送出編輯請求
  putSetting: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const loginUserId = req.user.id
      console.log('loginUserId 是:' + loginUserId)

      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位都是必填的')
      }

      if (password !== checkPassword) {
        errors.push('密碼與確認密碼不相同')
      }

      const [sameAccount, sameEmail] = await Promise.all([
        User.findOne({ where: { account, id: { [Op.ne]: loginUserId } } }),
        User.findOne({ where: { email, id: { [Op.ne]: loginUserId } } })
      ])

      if (sameEmail) {
        errors.push('email 已重複註冊！')
      }
      if (sameAccount) {
        errors.push('account 已重複註冊！')
      }

      if (errors.length) {
        return res.render('setting', { error_messages: errors, account, name, email, closeColumn: true })
      }

      const user = await User.findOne({
        where: { id: loginUserId }
      })

      if (user) {
        const hash = await bcrypt.hash(password, 10)
        await user.update({
          account,
          name,
          email,
          password: hash
        })
        req.flash('success_messages', '已成功編輯帳號')
        res.redirect('back')
      } else {
        req.flash('error_messages', '找不到此帳號')
        res.redirect('back')
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  },

  // 更新頭貼請求
  postAvatar: async (req, res, next) => {
    try {
      const loginUserId = req.params.id

      const { file } = req
      const filePath = await imgurFileHandler(file)

      const user = await User.findOne({
        where: { id: loginUserId }
      })

      if (user) {
        await user.update({
          avatar: filePath || user.avatar
        })
        req.flash('success_messages', '頭像更新成功')
        res.redirect('back')
      } else {
        req.flash('error_messages', '找不到使用者')
        res.redirect('back')
      }
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
