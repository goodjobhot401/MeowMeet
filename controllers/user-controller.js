const { User } = require('../models')

const userController = {
  signInPage: (req, res, next) => {
    try {
      res.render('signin')
    } catch (err) {
      console.log(err)
      next(err)
    }

  },

  signUpPage: (req, res, next) => {
    try {
      res.render('signup')
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = userController
