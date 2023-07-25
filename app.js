// 如果環境名不是production就引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const handlebarsHelper = require('./helpers/handlebar-helpers')
const routes = require('./routes')
const googleApi = require('./googleApi')
const app = express()
// const flash = require('connect-flash')
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelper }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

// app.use(flash())
app.use((req, res, next) => {
  // res.locals.success_messages = req.flash('success_messages')
  // res.locals.error_messages = req.flash('error_messages')
  // res.locals.warning_messages = req.flash('warning_messages')
  res.locals.googleMapsApiKey = googleApi.googleMapsApiKey
  next()
})

app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

module.exports = app
