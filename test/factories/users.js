const faker = require('faker')

exports.fakeUser = () => ({
  username: faker.random.word(),
  passwordHash: faker.random.uuid()
})