const users = require('./users')

const register = async (server, options) => {
  await server.register(users)
}

module.exports = {
  name: 'App api',
  version: '1.0.0',
  register
}