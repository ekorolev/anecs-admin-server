const Joi = require('joi')

exports.authorizationHeader = Joi.string().regex(/^Bearer\ .*/).required()