const {
  User,
  Token
} = require('../models')
const boom = require('boom')

/**
 * Will validate request with token
 * 
 * @param {Boolean} isRequired - if true, it will throw exception when unauthorized request
 * @return {Token} False, if request isn't authorized, Token if request is authorized 
 */
exports.tokenValidation = (isRequired) => ({
  assign: 'token',
  method: async (req) => {
    if (!req.headers['token']) {
      if (!isRequired) return null
      throw boom.unauthorized('TokenHeaderIsRequired')
    }
    const token = await Token.findByAccessToken(req.headers['token'])
    if (!token) {
      if (!isRequired) return null
      throw boom.unauthorized('Unauthorized request')
    }
    if (Date.now() > token.accessTokenExpiresIn) {
      if (!isRequired) return null
      throw boom.unauthorized('TokenExpired')
    }
    return token
  }
})

exports.userExtraction = (isRequired) => ({
  assign: 'user',
  method: async (req) => {
    const token = req.pre.token
    const user = await User.findById(token.userId)
    if (!user) {
      await token.remove()
      if (!isRequired) return null
      throw boom.badRequest('User was deleted')
    }
    return user
  }
})

exports.checkAccess = (role, isRequired) => ({
  assign: 'access',
  method: async (req) => {
    const user = req.pre.user
    if (role!==user.role) {
      if (!isRequired) return false
      throw boom.unauthorized('You haven\' access')
    }
    return true
  }
})