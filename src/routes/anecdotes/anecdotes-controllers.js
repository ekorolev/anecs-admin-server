const { Anecdote } = require('../../models')

exports.all = async (req) => {
  const findOptions = {}
  let {
    before, size
  } = req.query
  if (before) {
    findOptions.createdAt = { $lt: parseInt(before) }
  }
  size = size ? parseInt(size) : 10
  const anecdotes = await Anecdote.find(findOptions).sort({ createdAt: -1 }).limit(size)
  const count = await Anecdote.countDocuments(findOptions)
  return {
    anecdotes,
    count
  }
}

exports.count = () => {
  return Anecdote.countDocuments()
}

exports.create = async (req, reply) => {
  const {
    text,
    author
  } = req.payload

  const anecdote = new Anecdote({
    createdAt: Date.now(),
    text,
    author
  })
  await anecdote.save()
  return { message: 'OK', anecdote }
}