const Routes = require('./routes')

const register = server => {
  server.route(Routes(server))
}

module.exports = {
  version: '1.0.0',
  name: 'User api',
  register
}