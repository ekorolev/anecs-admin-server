const {
  all,
  count,
  create,
  unpublished
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
    method: 'GET',
    path: '/anecdotes/unpublished',
    handler: unpublished,
    options: {
      pre: [
        tokenValidation(),
        userExtraction(),
        checkAccess('admin')
      ]
    }
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