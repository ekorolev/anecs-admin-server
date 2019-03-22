const validate = require('../../utils/validate')
const {
  signin,
  signout,
  signup,
  refreshToken
} = require('./auth-controllers')

module.exports = [
  {
    method: 'POST',
    path: '/signin',
    handler: signin,
    options: {
      validate: {
        payload: {
          username: validate.auth.username.required(),
          password: validate.auth.password.required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/signout',
    handler: signout,
    options: {
      validate: {
        payload: {
          tokenId: validate.auth.tokenId.required(),
          accessToken: validate.auth.accessToken.required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/signup',
    handler: signup,
    options: {
      validate: {
        payload: {
          username: validate.auth.username.required(),
          password: validate.auth.password.required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/refresh',
    handler: refreshToken,
    options: {
      validate: {
        payload: {
          tokenId: validate.auth.tokenId.required(),
          accessToken: validate.auth.accessToken.required(),
          refreshToken: validate.auth.refreshToken.required()
        }
      }
    }
  }
]