const joi = require('joi')

exports.auth = {
  username: joi.string().token().min(3).label('Username must be token with at least 3 chars'),
  password: joi.string().min(5).label('Password must contain at least 3 chars'),
  tokenId: joi.string().label('tokenId must be uuid'),
  accessToken: joi.string().uuid().label('accessToken must be uuid'),
  refreshToken: joi.string().uuid().label('refreshToken must be uuid')
}