const { Anecdote } = require('../../models')

exports.all = async (req) => {
  const findOptions = {
    status: Anecdote.statuses.PUBLISHED
  }
  let {
    before, size
  } = req.query
  if (before) {
    findOptions.publishedAt = { $lt: parseInt(before) }
  }
  size = size ? parseInt(size) : 10
  const anecdotes = await Anecdote.find(findOptions).sort({ publishedAt: -1 }).limit(size)
  const count = await Anecdote.countDocuments(findOptions)
  return {
    anecdotes,
    count
  }
}

exports.count = () => {
  return Anecdote.countDocuments({ status: Anecdote.statuses.PUBLISHED })
}

exports.unpublished = async () => {
  return await Anecdote.find({ status: Anecdote.statuses.FOR_PUBLICATION })
}

exports.create = async (req, reply) => {
  const {
    text,
    author,
    status
  } = req.payload

  const anecdote = new Anecdote({
    createdAt: Date.now(),
    status: status || Anecdote.statuses.PUBLISHED, 
    text,
    author
  })
  await anecdote.save()
  return { message: 'OK', anecdote }
}