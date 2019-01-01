const mongoose = require('mongoose')
const Schema = mongoose.Schema

const citySchema = new Schema({
  name: String,
  updatedAt: String,
  temperature: Number,
  condition: String,
  conditionPic: String,
  saved: Boolean,
  time: { type: Date, default: Date.now }
})

const City = mongoose.model('City', citySchema)
module.exports = City
