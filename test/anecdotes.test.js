const { expect } = require('chai')
const configureServer = require('../src/server').configureServer
const userFactory = require('./factories/users')
const mockedDb = require('./mockedDb')

describe('Check anecdotes api works well', () => {
  let server
  const prefix = '/api/anecdotes'
  let token
  let Models

  before(async function () {
    // My MacOS can't connect to MongoUnit fast
    this.timeout(10000)
    Models = await mockedDb.connect()
    server = await configureServer(null, Models)
    await server.start()
    const user = new Models.User(userFactory.fakeUser())
    await user.save()
    token = Models.Token.createToken(user._id)
    await token.save()
  })

  it('Get all anecdotes, database is empty', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `${prefix}`,
      headers: {
        authorization: `Bearer ${token.accessToken}`
      }
    })
    expect(response.statusCode).eq(200)
  })

  after(async () => {
    await mockedDb.disconnect()
    await server.stop()
  })
})