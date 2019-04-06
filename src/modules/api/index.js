const users = require('./users')
const anecdotes = require('./anecdotes')

const register = async (server, options) => {
  await server.register(users, {
    routes: {
      prefix: '/users'
    }
  })
  await server.register(anecdotes, {
    routes: {
      prefix: '/anecdotes'
    }
  })
}

module.exports = {
  name: 'App api',
  version: '1.0.0',
  register
}