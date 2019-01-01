// Server setup
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const api = require('./server/routes/api')




// Mongoose setup
const mongoose = require('mongoose')
mongoose.connect(process.env.CONNECTION_STRING ||
  'mongodb://localhost/weatherDB',
  { useNewUrlParser: true }
).then(() => console.log("DB Connected"))

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', api)





app.listen(process.env.PORT || '8080', function () {
  console.log(`Running on port ${port} - ${Date()}`)
})
