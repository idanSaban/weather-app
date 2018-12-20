const express = require('express')
const router = express.Router()
const request = require('request')
const City = require('../models/city')
const moment = require('moment')

router.get('/city/:cityName', function (req, res) {
  request(`http://api.apixu.com/v1/current.json?key=bfe068d6e27046cfbec112504181912&q=${req.params.cityName}`, function (error, response, body) {
    const condition = JSON.parse(body)
    condition.updatedAt = moment(condition.current.last_updated).format("lll")
    res.send(condition)
  }
  )
})

router.get('/cities', function (req, res) {
  City.find({}).exec(function (err, cities) {
    // cities.map(c => c.updatedAt = moment(c.updatedAt).format("lll"))
    res.send(cities)
  })
})
router.post('/city', function (req, res) {
  console.log(req.body)
  const newCity = new City({
    name: req.body.name,
    updatedAt: req.body.updatedAt,
    temperature: req.body.temperature,
    condition: req.body.condition,
    conditionPic: req.body.conditionPic,
    saved: true
  })
  newCity.save()
  res.send(newCity)
})

router.delete('/city/:cityName', function (req, res) {
  const city = req.params
  City.findOneAndRemove({ name: city.cityName }).exec(function (err, city) {
    city.saved = false
    res.send(city)
  })
})

router.put('/city/:cityName', function (req, res) {
  const cityName = req.params.cityName
  console.log(cityName)
  request(`http://api.apixu.com/v1/current.json?key=bfe068d6e27046cfbec112504181912&q=${cityName}`, function (error, response, body) {
    const condition = JSON.parse(body)
    condition.updatedAt = moment(condition.current.last_updated).format("lll")
    City.findOneAndUpdate({ name: cityName }, condition, { new: true }).exec(function (err, city) {
      res.send(city)
    })
  })
})



module.exports = router
