module.exports = server => {
  const handlers = require('./handlers')(server)
  return [
    {
      method: 'GET',
      path: '/me',
      handler: handlers.getCurrentUser
    },
    {
      method: 'POST',
      path: '/login',
      config: {
        auth: false
      },
      handler: handlers.login
    },
    {
      method: 'POST',
      path: '/register',
      config: {
        auth: false
      },
      handler: handlers.register
    },
    {
      method: 'POST',
      path: '/refreshToken',
      config: {
        auth: false
      },
      handler: handlers.refreshToken
    }
  ]
}