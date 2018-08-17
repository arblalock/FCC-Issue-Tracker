'use strict'
try {
  require('dotenv').config()
} catch (e) {
  console.log('no dotenv module')
}
var express = require('express')
var bodyParser = require('body-parser')
var expect = require('chai').expect
var cors = require('cors')
const helmet = require('helmet')
var apiRoutes = require('./routes/api.js')
var fccTestingRoutes = require('./routes/fcctesting.js')
var runner = require('./test-runner')
const mongoose = require('mongoose')
var app = express()

app.use('/public', express.static(process.cwd() + '/public'))

app.use(cors({origin: '*'})) // For FCC testing purposes only
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Start our server and tests!
mongoose.connect(process.env.DB, (err, db) => {
  if (err) return console.error(err)
  // Sample front-end
  app.route('/:project/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/issue.html')
    })

  // Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html')
    })
  fccTestingRoutes(app, db)
  apiRoutes(app, db)

  app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + (process.env.PORT || 3000))
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...')
      setTimeout(function () {
        try {
          runner.run()
        } catch (e) {
          var error = e
          console.log('Tests are not valid:')
          console.log(error)
        }
      }, 3500)
    }
  })
  // 404 Not Found Middleware
  app.use(function (req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found')
  })
})

module.exports = app // for testing
