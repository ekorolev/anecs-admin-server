const validation = require('./validation')

module.exports = server => {
  const handlers = require('./handlers')(server)
  return [
    {
      method: 'GET',
      path: '/me',
      handler: handlers.getCurrentUser,
      options: {
        description: 'Get current user',
        notes: 'Return detailed info about current user',
        tags: ['api', 'users']
      }
    },
    {
      method: 'POST',
      path: '/login',
      config: {
        auth: false,
        description: 'Login to the system',
        notes: 'Returns access and refresh tokens if provided credentials are correct',
        tags: ['api', 'users', 'auth'],
        validate: {
          payload: validation.loginValidation
        }
      },
      handler: handlers.login
    },
    {
      method: 'POST',
      path: '/register',
      config: {
        auth: false,
        description: 'Register to the system',
        notes: 'Creates a new user and returns access and refresh tokens',
        tags: ['api', 'users', 'auth'],
        validate: {
          payload: validation.registerValidation
        }
      },
      handler: handlers.register
    },
    {
      method: 'POST',
      path: '/refreshToken',
      config: {
        auth: false,
        description: 'Refresh access token',
        notes: 'Refreshes access token if provided refresh token is valid',
        tags: ['api', 'users', 'auth'],
        validate: {
          payload: validation.refreshValidation
        }
      },
      handler: handlers.refreshToken
    }
  ]
}