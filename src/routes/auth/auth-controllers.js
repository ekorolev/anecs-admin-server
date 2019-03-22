const uuid4 = require('uuid4')
const { 
  User,
  Token
} = require('../../models')
const { errorMessages } = require('../../utils/messages')
const ACCESS_TOKEN_EXPIRES = 60 * 60 * 1000
const REFRESH_TOKEN_EXPIRES = 180 * 24 * 60 * 60 * 1000

const badSigninResponse = {
  error: 'Unauthorized request',
  message: 'Wrong username or password'
}

exports.signin = async (req, reply) => {
  const { username, password } = req.payload
  const user = await User.findByUsername(username)
  if (!user || !user.checkPassword(password)) {
    return reply.response(badSigninResponse).code(401)
  }
  const token = new Token({
    userId: user._id,
    accessToken: uuid4(),
    refreshToken: uuid4(),
    accessTokenExpiresIn: Date.now() + ACCESS_TOKEN_EXPIRES,
    refreshTokenExpiresIn: Date.now() + REFRESH_TOKEN_EXPIRES,
    createdAt: Date.now(),
    refreshedAt: Date.now()
  })
  try {
    await token.save()
    return {
      message: 'OK',
      tokenId: token._id.toString(),
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    }
  } catch(e) {
    console.log(`Save token error. Token: `, token, `\nerror: `, e)
    return reply.response({ error: errorMessages.SYSTEM }).code(500)
  }
}

exports.signout = async (req, reply) => {
  const { tokenId, accessToken } = req.payload
  const token = await Token.findById(tokenId)
  if (!token || accessToken!==token.accessToken) {
    return reply.response({ error: 'Unauthorized request' }).code(401)
  }
  try {
    await token.remove()
    return { message: 'OK' }
  } catch(e) {
    console.log(`Error with deleting token ${tokenId}`, e)
    return reply.response({ error: errorMessages.SYSTEM }).code(500)
  }
}

exports.signup = async (req, reply) => {
  const { username, password } = req.payload
  const user = new User({ username, passwordHash: password })
  try {
    await user.save()
    const token = new Token({
      userId: user._id,
      accessToken: uuid4(),
      refreshToken: uuid4(),
      accessTokenExpiresIn: Date.now() + ACCESS_TOKEN_EXPIRES,
      refreshTokenExpiresIn: Date.now() + REFRESH_TOKEN_EXPIRES,
      createdAt: Date.now(),
      refreshedAt: Date.now()
    })
    await token.save()
    return {
      message: 'OK',
      tokenId: token._id.toString(),
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    }
  } catch(e) {
    console.log(`Error with create user ${username}: `, e)
    return reply.response({ error: errorMessages.SYSTEM }).code(500)
  }
}

exports.refreshToken = async (req, reply) => {
  const { tokenId, accessToken, refreshToken } = req.payload
  const token = await Token.findById(tokenId)
  if (!token) {
    return reply.response({ error: 'Unauthorized request' }).code(401)
  }
  if (accessToken !== token.accessToken || refreshToken !== token.refreshToken) {
    return reply.response({ error: 'Unauthorized request' }).code(401)
  }
  if (Date.now() > token.refreshTokenExpiresIn) {
    await Token.remove()
    return reply.response({ error: 'Expired', message: 'Refresh token expired'}).code(401)
  }
  token.accessToken = uuid4()
  token.refreshToken = uuid4()
  token.accessTokenExpiresIn = Date.now() + ACCESS_TOKEN_EXPIRES
  token.refreshTokenExpiresIn = Date.now() + REFRESH_TOKEN_EXPIRES
  token.refreshedAt = Date.now()
  try {
    await token.save()
    return {
      message: 'OK',
      accessToken: token.accessToken,
      refreshToken: token.refreshToken
    }
  } catch(e) {
    return reply.response({ error: errorMessages.SYSTEM }).code(500)
  }
}