const Boom = require('boom')
const MONGOOSE_DUPLICATE_ERROR = 11000

module.exports = server => {
  const User = server.app.models.User
  const Token = server.app.models.Token

  return {
    async getCurrentUser (request, h) {
      return request.auth.credentials.user
    },

    async login (request, h) {
      const { username, password } = request.payload
      const user = await User.findByUsername(username)
      if (!user || !user.checkPassword(password)) {
        return Boom.unauthorized('invalid username or password')
      }

      const token = Token.createToken(user._id)
      try {
        await token.save()
        return {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken
        }
      } catch(e) {
        return Boom.badImplementation(e)
      }
    },

    async register(request, h) {
      const { username, password } = request.payload
      const user = new User({ username, passwordHash: password })
      try {
        await user.save()
        const token = Token.createToken(user._id)
        await token.save()
        return {
          message: 'OK',
          accessToken: token.accessToken,
          refreshToken: token.refreshToken
        }
      } catch(e) {
        if (e.code === MONGOOSE_DUPLICATE_ERROR) {
          return Boom.unauthorized('That username is already created')
        }
        return Boom.badImplementation(e)
      }
    },

    async refreshToken(request, h) {
      const { accessToken, refreshToken } = request.payload
      const token = await Token.findByAccessToken(accessToken)
      if (!token) {
        return Boom.unauthorized('invalid token')
      }
      if (accessToken !== token.accessToken || refreshToken !== token.refreshToken) {
        return Boom.unauthorized('invalid token')
      }
      if (Date.now() > token.refreshTokenExpiresIn) {
        await token.remove()
        return Boom.unauthorized('refresh token expired')
      }
      token.refresh()
      try {
        await token.save()
        return {
          accessToken: token.accessToken,
          refreshToken: token.refreshToken
        }
      } catch(e) {
        return Boom.badImplementation(e)
      }
    }
  }
}