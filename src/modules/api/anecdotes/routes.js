module.exports = server => {
  const handlers = require('./handlers')(server)
  return [
    {
      method: 'GET',
      path: '/',
      handler: handlers.all,
      options: {
        description: 'Get all anecdotes',
        tags: ['api', 'anecdotes']
      }
    }
  ]
}