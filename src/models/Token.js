const mongoose = require('mongoose')
const uuid4 = require('uuid4')
const ACCESS_TOKEN_EXPIRES = 5 * 60 * 1000
const REFRESH_TOKEN_EXPIRES = 180 * 24 * 60 * 60 * 1000
const Schema = mongoose.Schema

const TokenSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenExpiresIn: { type: Date, required: true },
  refreshTokenExpiresIn: { type: Date, required: true },
  userAgent: String,
  ip: String,
  createdAt: Date,
  refreshedAt: Date
})

TokenSchema.statics.findByAccessToken = function (token) {
  return this.findOne({ accessToken: token })
}

TokenSchema.statics.createToken = function (userId) {
  return new this({
    userId,
    accessToken: uuid4(),
    refreshToken: uuid4(),
    accessTokenExpiresIn: Date.now() + ACCESS_TOKEN_EXPIRES,
    refreshTokenExpiresIn: Date.now() + REFRESH_TOKEN_EXPIRES,
    createdAt: Date.now(),
    refreshedAt: Date.now()
  })
}

TokenSchema.methods.refresh = function () {
  this.accessToken = uuid4()
  this.refreshToken = uuid4()
  this.accessTokenExpiresIn = Date.now() + ACCESS_TOKEN_EXPIRES
  this.refreshTokenExpiresIn = Date.now() + REFRESH_TOKEN_EXPIRES
  this.refreshedAt = Date.now()
}

module.exports = mongoose.model('tokens', TokenSchema)