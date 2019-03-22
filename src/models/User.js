const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuid4 = require('uuid4')
const { createHmac } = require('crypto')

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    default: 'user'
  },
  passwordHash: String,
  salt: String
})

UserSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username })
}

UserSchema.pre('save', async function () {
  if (this.isNew) {
    this.salt = uuid4()
    this.passwordHash = createHmac('sha256', this.salt).update(this.passwordHash).digest('hex')
  }
})

UserSchema.methods.checkPassword = function (pass) {
  const hash = createHmac('sha256', this.salt).update(pass).digest('hex')
  return hash === this.passwordHash
}

module.exports = mongoose.model('users', UserSchema)