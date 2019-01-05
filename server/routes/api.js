const express = require('express')
const router = express.Router()
const request = require('request')
const City = require('../models/city')
const User = require('../models/user')
const moment = require('moment')

router.get('/allcities/', async function (req, res) {
  res.send(await City.find({}))
})

// this function checks if city  exist
const cityExist = async function (cityName) {
  const city = await City.findOne({ name: cityName })
  if (city)
  {
    return true
  }
  return false
}

//this function checks if city was update in the past two hours and not it updates its data
const update = async function (cityName) {
  const city = await City.findOne({ name: cityName })
  const lastUpdate = moment().diff(moment(city.time), 'h')
  console.log(` -- ${city.name}`)
  console.log(`last update ${lastUpdate} hours ago`)
  if (lastUpdate > 2)
  {
    await request(`http://api.apixu.com/v1/current.json?key=bfe068d6e27046cfbec112504181912&q=${city.name}`, (error, response, body) => {
      const condition = JSON.parse(body)
      city.name = city.name
      city.temperature = condition.current.temp_c
      city.condition = condition.current.condition.text
      city.conditionPic = condition.current.condition.icon
      city.updatedAt = moment(condition.current.last_updated).format("lll")
      city.time = new Date()
      city.save()
    })
  }
}

router.get('/test/:cityName', async function (req, res) {
  if (await cityExist(req.params.cityName))
  {
    await update(req.params.cityName)
    res.send(await City.find({ cityName: req.params.cityName }))
  } else
  {
    res.end()
  }
})

router.get('/user', async function (req, res) {
  const newUser = new User
  await newUser.save()
  res.send(newUser)
})

router.get('/city/:cityName', async function (req, res) {
  if (await cityExist(req.params.cityName))
  {
    await update(req.params.cityName)
    const condition = await City.find({ name: req.params.cityName })
    console.log(condition)
    res.send(condition[0])
  }
  else
  {
    request(`http://api.apixu.com/v1/current.json?key=bfe068d6e27046cfbec112504181912&q=${req.params.cityName}`, function (error, response, body) {
      const condition = JSON.parse(body)
      if (!condition.error)
      {
        const newObj = {
          name: condition.location.name,
          temperature: condition.current.temp_c,
          condition: condition.current.condition.text,
          conditionPic: condition.current.condition.icon,
          updatedAt: condition.updatedAt
        }
        res.send(newObj)
      }
      res.end()
    })
  }
})

router.post('/city/:user', async function (req, res) {
  const userId = req.params.user
  let city
  if (await cityExist(req.body.name))
  {
    city = await City.findOne({ name: req.body.name })
  } else
  {
    city = new City({
      name: req.body.name,
      updatedAt: req.body.updatedAt,
      temperature: req.body.temperature,
      condition: req.body.condition,
      conditionPic: req.body.conditionPic,
      saved: true
    })
    await city.save()

  }
  User.findByIdAndUpdate(
    userId,
    { $addToSet: { cities: city } },
    { new: true })
    .populate("cities")
    .exec(function (err, user) {
      res.send(user)
    })
})


router.get('/cities/:user', function (req, res) {
  const userId = req.params.user
  User.findById(userId)
    .populate('cities')
    .exec(async function (err, user) {
      await user.cities.forEach(c => update(c.name))
      res.send(user.cities)
    })
})

router.delete('/city/:user/:cityName', function (req, res) {
  const userId = req.params.user
  const city = req.params.cityName
  User.findById(userId)
    .populate('cities')
    .exec(function (err, user) {
      user.cities = user.cities.filter(c => c.name !== city)
      user.save().then(() => res.send(user))
    })
})

module.exports = router
