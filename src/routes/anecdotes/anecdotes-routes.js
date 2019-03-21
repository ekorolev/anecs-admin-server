const {
  all,
  count,
  create
} = require('./anecdotes-controllers')

module.exports = [
  {
    method: 'GET',
    path: '/anecdotes',
    handler: all
  },
  {
    method: 'GET',
    path: '/anecdotes/count',
    handler: count
  },
  {
    method: 'POST',
    path: '/anecdotes/create',
    handler: create
  }
]