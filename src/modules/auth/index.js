const AuthBearer = require('hapi-auth-bearer-token')

const register = async (server, options) => {
  await server.register(AuthBearer)
  server.auth.strategy('simple', 'bearer-access-token', {
    validate: async (request, token, h) => {
      const Token = server.app.models.tokens
      const User = server.app.models.users

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
        credentials: { token },
        artifacts: { user }
      }
    }
  })
  server.auth.default('simple')
}

module.exports = {
  name: 'Authorization system',
  version: '1.0.0',
  register
}