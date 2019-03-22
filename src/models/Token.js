const mongoose = require('mongoose')
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

module.exports = mongoose.model('tokens', TokenSchema)