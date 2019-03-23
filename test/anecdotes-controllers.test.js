const mongoUnit = require('mongo-unit')
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.set('debug', false)
const mongoUnitConnect = mongoUnit.start()
const should = require('chai').should()
const { Anecdote } = require('../src/models')

const {
  all
} = require('../src/routes/anecdotes/anecdotes-controllers')

const testDB = {
  anecdotes: [
    {
      _id: 'test1',
      author: 'test1',
      text: 'test1',
      status: Anecdote.statuses.PUBLISHED,
      createdAt: Date.now() - 10000,
      publishedAt: Date.now() - 10000
    },
    {
      _id: 'test2',
      author: 'test2',
      text: 'test2',
      status: Anecdote.statuses.PUBLISHED,
      createdAt: Date.now() - 20000,
      publishedAt: Date.now() - 5000
    },
    {
      _id: 'test3',
      author: 'test3',
      text: 'test3',
      status: Anecdote.statuses.FOR_PUBLICATION,
      createdAt: Date.now() - 20000,
      publishedAt: null
    }
  ]
}

describe('Check anecdotes controllers work well', () => {
  before(async function () {
    // My MacOS can't connect to MongoUnit fast
    this.timeout(10000)
    const url = await mongoUnitConnect
    return mongoose.connect(url, { useNewUrlParser: true })
  })

  describe('with empty database', () => {
    before(async () => {
      await mongoUnit.dropDb()
    })
    it('Get all anecdotes, query parameters are empty', async () => {
      const result = await all({ query: {}})
      result.should.haveOwnProperty('count')
      result.count.should.equal(0)
      result.should.haveOwnProperty('anecdotes')
      result.anecdotes.should.be.a('array')
      result.anecdotes.length.should.eq(0)
    }) 
  })

  describe('with full database', () => {
    before(async function () {
      await mongoUnit.dropDb()
      await mongoUnit.load(testDB)
    })
    it('Get all anecdotes, query parameters are empty', async() => {
      const result = await all({ query: {}})
      result.should.haveOwnProperty('count')
      result.count.should.equal(2)
      result.should.haveOwnProperty('anecdotes')
      result.anecdotes.should.be.a('array')
      result.anecdotes.length.should.eq(2)      
    })
  })

  after(async () => {
    await mongoose.disconnect()
    return mongoUnit.stop()
  })
})