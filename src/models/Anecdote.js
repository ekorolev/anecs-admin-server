const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AnecdoteSchema = new Schema({
  text: String,
  author: String,
  createdAt: Date,
  publishedAt: Date,
  status: {
    type: String,
    enum: ['FOR_PUBLICATION', 'PUBLISHED']
  }
})

AnecdoteSchema.statics.statuses = {
  PUBLISHED: 'PUBLISHED',
  FOR_PUBLICATION: 'FOR_PUBLICATION'
}

module.exports = mongoose => mongoose.model('anecdotes', AnecdoteSchema)