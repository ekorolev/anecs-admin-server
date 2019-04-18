const Joi = require('joi')

module.exports = server => {
  const handlers = require('./handlers')(server)
  const validation = require('./validation')
  const authValidation = server.app.auth.validation

  return [
    {
      method: 'GET',
      path: '/',
      handler: handlers.all,
      options: {
        description: 'Get all anecdotes',
        tags: ['api', 'anecdotes'],
        response: {
          status: {
            200: validation.list
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/{id}/delete',
      handler: handlers.delete,
      options: {
        description: 'Delete an specific anecdote',
        tags: ['api', 'anecdotes'],
        validate: {
          params: {
            id: Joi.string().required()
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/',
      handler: handlers.create,
      options: {
        description: 'Create a new anecdote',
        tags: ['api', 'anecdotes'],
        validate: {
          payload: validation.createAnecdotePayload
        }
      }
    }
  ]
}