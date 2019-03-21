const crypto = require('crypto')

/**
 * Provide controllers for the application
 */
class Controllers {
  /**
   * Depends on Env and DB service
   * @param {service} env - Environment dependency
   * @param {service} db - DB dependency
   */
  constructor(env, mongo) {
    this.env = env
    this.db = mongo.db
  }

  async getAnecdotes(req, res) {
    const findOption = {}
    let size = 10
  
    if (req.query.before) {
      findOption.createdAt = { $lt: parseInt(req.query.before) }
    }
  
    if (req.query.size) {
      size = parseInt(req.query.size)
    }
  
    const anecdotes = await this.db.collection('anecdotes')
      .find(findOption)
      .sort({ createdAt: -1 })
      .limit(size)
      .toArray()
  
    const count = await this.db.collection('anecdotes')
      .countDocuments(findOption)
  
    return res.json({
      anecdotes,
      count
    })
  }

  async getAnecdotesCount(req, res) {
    const count = await this.db.collection('anecdotes')
    .countDocuments({})

    return res.json(count)
  }

  async createAnecdote(req, res) {
    const HMAC_SECRET = this.env.get('HMAC_SECRET')
    const COMPARE_HASH = this.env.get('COMPARE_HASH')
  
    if (!req.body.secretCode) {
      return res.status(401).json({ error: 'Access denied' })
    }
    const hash = crypto.createHmac('sha256', HMAC_SECRET)
      .update(req.body.secretCode)
      .digest('hex')
  
    if (hash !== COMPARE_HASH) {
      return res.status(401).json({ error: 'Access denied' })
    }
  
    const result = await this.db.collection('anecdotes').insertOne({
      createdAt: Date.now(),
      text: req.body.text,
      author: req.body.author
    })
    res.json({ message: 'OK', anecdote: result.ops[0] })
  }
}

module.exports = Controllers