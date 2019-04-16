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
    }
  ]
}