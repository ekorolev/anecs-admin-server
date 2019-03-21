const Anecdote = require('../../models/Anecdote')
const crypto = require('crypto')

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
  const hmac_secret = process.env.HMAC_SECRET
  const compareHash = process.env.COMPARE_HASH
  const {
    secretCode,
    text,
    author
  } = req.payload

  if (!secretCode) {
    reply.code(401)
    return { error: 'Access denied' }
  }

  const hash = crypto.createHmac('sha256', hmac_secret)
    .update(secretCode)
    .digest('hex')

  if (hash !== compareHash) {
    reply.code(401)
    return{ error: 'Access denied' }
  }

  const anecdote = new Anecdote({
    createdAt: Date.now(),
    text,
    author
  })
  await anecdote.save()
  return { message: 'OK', anecdote }
}