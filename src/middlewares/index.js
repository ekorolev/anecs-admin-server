const {
  User,
  Token
} = require('../models')
const boom = require('boom')

exports.tokenValidation = () => ({
  assign: 'token',
  method: async (req) => {
    if (!req.headers['token']) {
      throw boom.unauthorized('TokenHeaderIsRequired')
    }
    const token = await Token.findByAccessToken(req.headers['token'])
    if (!token) {
      throw boom.unauthorized('Unauthorized request')
    }
    if (Date.now() > token.accessTokenExpiresIn) {
      throw boom.unauthorized('TokenExpired')
    }
    return token
  }
})

exports.userExtraction = () => ({
  assign: 'user',
  method: async (req) => {
    const token = req.pre.token
    const user = await User.findById(token.userId)
    if (!user) {
      await token.remove()
      throw boom.badRequest('User was deleted')
    }
    return user
  }
})

exports.checkAccess = role => ({
  assign: 'access',
  method: async (req) => {
    const user = req.pre.user
    if (role!==user.role) {
      throw boom.unauthorized('You haven\' access')
    }
    return true
  }
})