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

  res.json(anecdotes)
}

/**
 * Add an anecdote to database
 */
exports.createAnecdote = db => async(req, res) => {
  const result = await db.collection('anecdotes').insertOne({
    createdAt: Date.now(),
    text: req.body.text,
    author: req.body.author
  })
  console.log(result.ops[0])
  res.json({ message: 'OK' })
}