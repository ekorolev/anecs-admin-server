const Joi = require('joi')

const username = Joi.string().alphanum().min(5).max(15)
const password = Joi.string().min(5)
const token = Joi.string()
const role = Joi.string().valid('admin', 'user')
const id = Joi.string()
const authorizationHeader = Joi.string().regex(/^Bearer\ .+/)

const currentUser = Joi.object({
  username: username.required(),
  _id: id.required(),
  role: role.required()
}).label('Current user info')

exports.loginValidation = Joi.object({
  username: username.required(),
  password: password.required()
}).label('Login credentials')

exports.registerValidation = Joi.object({
  username: username.required(),
  password: password.required()
}).label('Registration info')

exports.refreshValidation = Joi.object({
  accessToken: token.required(),
  refreshToken: token.required()
}).label('Access credentials')

exports.validLoginResponse = Joi.object({
  accessToken: token.required(),
  refreshToken: token.required()
}).label('Access credentials')

exports.currentUser = currentUser
exports.authorizationHeader = authorizationHeader.required()