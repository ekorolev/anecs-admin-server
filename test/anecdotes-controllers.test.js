const mongoUnit = require('mongo-unit')
const mongoose = require('mongoose')
const { Anecdote } = require('../src/models')
mongoose.set('useCreateIndex', true)
mongoose.set('debug', false)
const mongoUnitConnect = mongoUnit.start()
const _ = require('chai').should()
let mongoUrl = null

const {
  all,
  count,
  create
} = require('../src/routes/anecdotes/anecdotes-controllers')

const {
  fakeAnecdotes
} = require('./fakeData')

describe('Check anecdotes controllers work well', () => {
  before(async function () {
    // My MacOS can't connect to MongoUnit fast
    this.timeout(10000)
    mongoUrl = await mongoUnitConnect
    return mongoose.connect(mongoUrl, { useNewUrlParser: true })
  })

  describe('with empty database', () => {
    before(async () => {
      await mongoUnit.dropDb(mongoUrl)
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
    const anecs = [
      ...fakeAnecdotes(30, true),
      ...fakeAnecdotes(5, false)
    ]
    before(async function () {
      await mongoUnit.dropDb(mongoUrl)
      await mongoUnit.load({anecdotes: anecs})
    })
    it('Get all anecdotes, query parameters are empty', async() => {
      const result = await all({ query: {}})
      result.should.haveOwnProperty('count')
      result.count.should.equal(30)
      result.should.haveOwnProperty('anecdotes')
      result.anecdotes.should.be.a('array')
      result.anecdotes.length.should.eq(10)     
    })
    it('Get anecdotes acount', async() => {
      const result = await count()
      result.should.equal(30)
    })
    it('Get all anecdotes with "before" parameter', async() => {
      const sortedAnecs = anecs
        .filter(a => a.status === Anecdote.statuses.PUBLISHED)
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      const before = sortedAnecs[0].publishedAt.getTime()
      const result = await all({query:{before}})
      result.count.should.equal(29)
      result.anecdotes.length.should.equal(10)
    })
    it('Create an anecdote', async() => {
      const newAnecdote = fakeAnecdotes(1, false)[0]
      const result = await create({payload: newAnecdote})
      const allAnecs = await Anecdote.find({})
      allAnecs.length.should.equal(36)
      allAnecs.filter(a => a.status === Anecdote.statuses.PUBLISHED).length.should.equal(30)
    })
  })

  after(async () => {
    await mongoose.disconnect()
    return mongoUnit.stop()
  })
})