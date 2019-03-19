const crypto = require('crypto')

/**
 * Returns all anecdotes from database
 */
exports.getAnecdotes = db => async (req, res) => {
  const findOption = {}
  let size = 10

  if (req.query.before) {
    findOption.createdAt = { $lt: parseInt(req.query.before) }
  }

  if (req.query.size) {
    size = parseInt(req.query.size)
  }

  const anecdotes = await db.collection('anecdotes')
    .find(findOption)
    .sort({ createdAt: -1 })
    .limit(size)
    .toArray()

  const count = await db.collection('anecdotes')
    .countDocuments(findOption)

  return res.json({
    anecdotes,
    count
  })
}

/**
 * Returns anecdote count
 */
exports.getAnecdotesCount = db => async (req, res) => {
  const count = await db.collection('anecdotes')
    .countDocuments({})

  return res.json(count)
}

/**
 * Add an anecdote to database
 */
exports.createAnecdote = db => async(req, res) => {
  const HMAC_SECRET = process.env.HMAC_SECRET
  const COMPARE_HASH = process.env.COMPARE_HASH

  if (!req.body.secretCode) {
    return res.status(401).json({ error: 'Access denied' })
  }
  const hash = crypto.createHmac('sha256', HMAC_SECRET)
    .update(req.body.secretCode)
    .digest('hex')

  if (hash !== COMPARE_HASH) {
    return res.status(401).json({ error: 'Access denied' })
  }

  const result = await db.collection('anecdotes').insertOne({
    createdAt: Date.now(),
    text: req.body.text,
    author: req.body.author
  })
  res.json({ message: 'OK', anecdote: result.ops[0] })
}