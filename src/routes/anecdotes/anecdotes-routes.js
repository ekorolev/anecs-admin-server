const {
  all,
  count,
  create
} = require('./anecdotes-controllers')
const {
  checkAccess,
  tokenValidation,
  userExtraction
} = require('../../middlewares')

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
    options: {
      pre: [
        tokenValidation(),
        userExtraction(),
        checkAccess('admin')
      ]
    },
    path: '/anecdotes/create',
    handler: create
  }
]