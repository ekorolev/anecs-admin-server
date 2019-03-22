const Hapi = require('hapi')
const mongoose = require('mongoose')
const path = require('path')
const inert = require('inert')
const routes = require('./routes')
const cors = require('hapi-cors')
require('dotenv').config()

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })

mongoose.connection.once('open', () => {
  console.log('connected to database')
})

const server = Hapi.server({
  port: process.env.PORT,
  host: process.env.HOST,
  routes: {
    files: {
        relativeTo: path.join(__dirname, 'public')
    }
  }
})

const init = async () => {
  await server.register(inert)
  await server.register({
    plugin: cors,
    options: {
      headers: ['Accept', 'Content-Type', 'Token']
    }
    
  })
  server.route(    {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
      }
    }
  })
  server.route(routes)

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

module.exports = init