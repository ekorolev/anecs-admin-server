const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnecdoteSchema = new Schema({
  text: String,
  author: String,
  createdAt: Number
})

module.exports = mongoose.model('anecdotes', AnecdoteSchema)