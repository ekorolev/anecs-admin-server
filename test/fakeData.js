const { Anecdote } = require('../src/models')
const faker = require('faker')

exports.fakeAnecdotes = (count, published) => Array.from(Array(count).keys())
  .map(() => ({
    _id: faker.random.uuid(),
    author: faker.name.firstName(),
    text: faker.lorem.paragraph(),
    createdAt: faker.date.recent(),
    publishedAt: published ? faker.date.recent() : null,
    status: published ? Anecdote.statuses.PUBLISHED : Anecdote.statuses.FOR_PUBLICATION
  }))