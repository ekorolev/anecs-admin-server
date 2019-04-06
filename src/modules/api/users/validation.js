const Joi = require('joi')

exports.loginValidation = {
  username: Joi.string().required(),
  password: Joi.string().required()
}

exports.registerValidation = {
  username: Joi.string().required(),
  password: Joi.string().required()
}

exports.refreshValidation = {
  accessToken: Joi.string().required(),
  refreshToken: Joi.string().required()
}