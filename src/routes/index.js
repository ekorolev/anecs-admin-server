const anecdotes = require('./anecdotes/anecdotes-routes')
const auth = require('./auth/auth-routes')

module.exports = [
  ...anecdotes,
  ...auth
]