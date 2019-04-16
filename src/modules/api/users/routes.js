  const validation = require('./validation')

module.exports = server => {
  const handlers = require('./handlers')(server)
  const authValidation = server.app.auth.validation

  return [
    {
      method: 'GET',
      path: '/me',
      handler: handlers.getCurrentUser,
      config: {
        description: 'Get current user',
        notes: 'Return detailed info about current user',
        tags: ['api', 'auth'],
        validate: {
          headers: {
            'authorization': authValidation.authorizationHeader
          }
        },
        response: {
          status: {
            200: validation.currentUser
          }
        }
      }
    },
    {
      method: 'POST',
      path: '/login',
      config: {
        auth: false,
        description: 'Login to the system',
        notes: 'Returns access and refresh tokens if provided credentials are correct',
        tags: ['api', 'auth'],
        validate: {
          payload: validation.loginValidation
        },
        response: {
          status: {
            200: validation.validLoginResponse
          }
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
        tags: ['api', 'auth'],
        validate: {
          payload: validation.registerValidation
        },
        response: {
          status: {
            200: validation.validLoginResponse
          }
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
        tags: ['api', 'auth'],
        validate: {
          payload: validation.refreshValidation,
          headers: {
            authorization: authValidation.authorizationHeader
          }
        },
        response: {
          status: {
            200: validation.validLoginResponse
          }
        }
      },
      handler: handlers.refreshToken
    }
  ]
}