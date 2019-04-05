const mongoUnit = require('mongo-unit')
const mongoose = require('mongoose')
const mongoUnitConnect = mongoUnit.start()
const Models = require('../src/models')
const { expect } = require('chai')
const configureServer = require('../src/server').configureServer
const faker = require('faker')
const userFactory = require('./factories/users')

describe('Check authentication works well', () => {
  let mongoUrl
  let server

  before(async function () {
    // My MacOS can't connect to MongoUnit fast
    this.timeout(10000)
    mongoUrl = await mongoUnitConnect
    server = await configureServer(null, Models)
    await server.start()
    return mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
  })

  it('Make /me request without token, should 401 status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/me'
    })
    expect(response.statusCode).eq(401, 'status code must be 401')
  })
  
  it('Make /me request with random token, should 401 status', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${faker.random.uuid()}`
      }
    })
    expect(response.statusCode).eq(401, 'status code must be 401')
  })

  it('Try to register new user, should return token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: faker.random.word(),
        password: faker.random.uuid()
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(200, 'Status code must be 200')
    expect(body).to.have.all.keys(['accessToken', 'refreshToken', 'message'])
  })

  it('Try to register new user, but user is already exist', async () => {
    const user = new Models.User(userFactory.fakeUser())
    await user.save()
    const response = await server.inject({
      method: 'POST',
      url: '/register',
      payload: {
        username: user.username,
        password: faker.random.uuid()
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(401, 'Status code must be 401')
    expect(body).to.have.ownProperty('error')
    expect(body.error).eq('Unauthorized')
  })

  it ('Try to login, user exists, but password is incorrect', async () => {
    const user = new Models.User(userFactory.fakeUser())
    const password = user.passwordHash
    await user.save()
    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: user.username,
        password: `modify_${password}`
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(401)
    expect(body.error).eq('Unauthorized')
  })

  it('Try to login, user exists, credentials are correct', async () => {
    const user = new Models.User(userFactory.fakeUser())
    const password = user.passwordHash
    await user.save()
    const response = await server.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: user.username,
        password
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(200)
    expect(body).to.have.all.keys(['accessToken', 'refreshToken', 'message'])
  })

  it('Try to request /me with correct token', async () => {
    const user = new Models.User(userFactory.fakeUser())
    await user.save()
    const token = Models.Token.createToken(user._id)
    await token.save()
    const response = await server.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${token.accessToken}`
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(200)
    expect(body).to.have.property('_id', `${user._id}`)
    expect(body).to.have.property('username', user.username)
  })

  it('Try to request /me with expired accessToken', async () => {
    const user = new Models.User(userFactory.fakeUser())
    await user.save()
    const token = Models.Token.createToken(user._id)
    token.accessTokenExpiresIn = Date.now() - 1
    await token.save()
    const response = await server.inject({
      method: 'GET',
      url: '/me',
      headers: {
        authorization: `Bearer ${token.accessToken}`
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(401)
    expect(body.error).eq('Unauthorized')
  })

  it('Try to refresh expired accessToken', async () => {
    const user = new Models.User(userFactory.fakeUser())
    await user.save()
    const token = Models.Token.createToken(user._id)
    token.accessTokenExpiresIn = Date.now() - 1
    await token.save()
    const response = await server.inject({
      method: 'POST',
      url: '/refreshToken',
      payload: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(200)
    expect(body).to.have.all.keys(['accessToken', 'refreshToken', 'message'])
    expect(body.accessToken).not.eq(token.accessToken, 'access token should be changed')
    expect(body.refreshToken).not.eq(token.refreshToken, 'refresh token should be changed')
  })

  it('Try to refresh expired refreshToken', async () => {
    const user = new Models.User(userFactory.fakeUser())
    await user.save()
    const token = Models.Token.createToken(user._id)
    token.accessTokenExpiresIn = Date.now() - 1
    token.refreshTokenExpiresIn = Date.now() - 1
    await token.save()
    const response = await server.inject({
      method: 'POST',
      url: '/refreshToken',
      payload: {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }
    })
    const body = JSON.parse(response.payload)
    expect(response.statusCode).eq(401)
    expect(body.message).eq('refresh token expired')
  })

  after(async () => {
    await mongoose.disconnect()
    await server.stop()
    return mongoUnit.stop()
  })
})