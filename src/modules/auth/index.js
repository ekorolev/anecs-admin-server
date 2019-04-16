const AuthBearer = require('hapi-auth-bearer-token')

const register = async (server, options) => {
  await server.register(AuthBearer)
  server.auth.strategy('simple', 'bearer-access-token', {
    validate: async (request, token, h) => {
      const Token = server.app.models.Token
      const User = server.app.models.User

      const tokenFromDb = await Token.findByAccessToken(token)
      if (!tokenFromDb) {
        return { isValid: false }
      }
      if (new Date(tokenFromDb.accessTokenExpiresIn) < Date.now()) {
        return { isValid: false }
      }

      const user = await User.findById(tokenFromDb.userId)
      if (!user) {
        return { isValid: false }
      }

      return {
        isValid: true,
        credentials: { token, user: user.getVisibleUser() }
      }
    }
  })
  server.auth.default('simple')
  server.app.auth = { validation: require('./validation') }
}

module.exports = {
  name: 'Authorization system',
  version: '1.0.0',
  register
}