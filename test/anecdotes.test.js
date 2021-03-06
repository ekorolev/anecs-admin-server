const { expect } = require('chai')
const configureServer = require('../src/server').configureServer
const userFactory = require('./factories/users')
const mockedDb = require('./mockedDb')

describe('Check anecdotes api works well', () => {
  let server
  const prefix = '/api/v1/anecdotes'
  let token
  let Models

  before(async function () {
    // My MacOS can't connect to MongoUnit fast
    this.timeout(10000)
    Models = await mockedDb.connect()
    server = await configureServer(null, Models)
    await server.start()
    const user = new Models.User(userFactory.fakeUser('admin'))
    await user.save()
    token = Models.Token.createToken(user._id)
    await token.save()
  })
  beforeEach(async () => {
    await Models.Anecdote.deleteMany({})
  })

  it('Get all anecdotes, database is empty', async () => {
    const response = await server.inject({
      method: 'GET',
      url: `${prefix}`,
      headers: {
        authorization: `Bearer ${token.accessToken}`
      }
    })
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).eq(200)
    expect(Array.isArray(payload)).to.be.true
    expect(payload.length).eq(0)
  })

  it('Get all anecdotes, should return an anecdote entire', async () => {
    const anecdote = new Models.Anecdote({
      text: 'some long text',
      author: 'admin',
      status: 'FOR_PUBLICATION',
      createdAt: Date.now()
    })
    await anecdote.save()
    const response = await server.inject({
      method: 'GET',
      url: `${prefix}`,
      headers: {
        authorization: `Bearer ${token.accessToken}`
      }
    })
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).eq(200)
    expect(Array.isArray(payload)).to.be.true
    expect(payload.length).eq(1)
    expect(payload[0].text).eq(anecdote.text)
    expect(payload[0]._id).eq(anecdote._id.toString())
  })

  it('Delete anecdote', async () => {
    const anecdote = new Models.Anecdote({
      text: 'some long text',
      author: 'admin',
      status: 'PUBLISHED',
      createdAt: Date.now()
    })
    await anecdote.save()
    const response = await server.inject({
      method: 'POST',
      url: `${prefix}/${anecdote._id}/delete`,
      headers: {
        authorization: `Bearer ${token.accessToken}`
      }
    })
    const anecs = await Models.Anecdote.find({})
    expect(anecs.length).eq(0)
  })

  it('Create an anecdote', async () => {
    const anecdote = {
      text: 'some long text',
      status: 'PUBLISHED'
    }
    const response = await server.inject({
      method: 'POST',
      url: `${prefix}`,
      headers: {
        authorization: `Bearer ${token.accessToken}`
      },
      payload: anecdote
    })
    const anecdotes = await Models.Anecdote.find()
    expect(response.statusCode).eq(200)
    expect(anecdotes.length).eq(1)
    expect(anecdotes[0].text).eq(anecdote.text)
    expect(anecdotes[0].author).eq('admin')
    expect(anecdotes[0].status).eq(anecdote.status)
  })

  it('Update an anecdote', async () => {
    const anecdote = new Models.Anecdote({
      text: 'some long text',
      author: 'admin',
      status: 'PUBLISHED',
      createdAt: Date.now()
    })
    const update = {
      text: 'edited text',
    }
    await anecdote.save()
    const response = await server.inject({
      method: 'POST',
      url: `${prefix}/${anecdote._id}`,
      headers: {
        authorization: `Bearer ${token.accessToken}`
      },
      payload: update
    })
    const newAnecdote = await Models.Anecdote.findById(anecdote._id)
    const payload = JSON.parse(response.payload)
    expect(response.statusCode).eq(200)
    expect(payload.text).eq(update.text)
    expect(newAnecdote.text).eq(update.text)
  })

  after(async () => {
    await mockedDb.disconnect()
    await server.stop()
  })
})