const Hapi = require('hapi')
const mongoose = require('mongoose')
const cors = require('hapi-cors')
require('dotenv').config()
const Models = require('./models')
const HapiSwagger = require('hapi-swagger')
const Inert = require('inert')
const Vision = require('vision')
const Boom = require('boom')

// Configure server, register plugins
const configureServer = async (server, models) => {
  if (!server) {
    server = new Hapi.Server({
      host: process.env.HOST || '0.0.0.0',
      port: process.env.PORT || 3501
    })
  }
  await server.register({
    plugin: cors,
    options: {
      headers: ['Accept', 'Content-Type', 'Authentication', 'authorization']
    }
  })
  server.app.models = models
  await server.register(require('./modules/auth'))
  await server.register(require('./modules/api'), {
    routes: {
      prefix: '/api/v1'
    }
  })
  if (process.env.SWAGGER === 'enable') {
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          basePath: '/api/v1',
          grouping: 'tags',
          info: {
            title: 'API Documentation',
            version: '1.0.0'
          }
        }
      }
    ])
  }
  return server
}

// Configure database, create connect
const configureDatabase = async () => {
  const mongoConnect = () => new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    mongoose.connection.once('open', resolve)
    mongoose.connection.once('error', reject)
  })
  await mongoConnect()
}

const httpServer = new Hapi.Server({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 3501
})

exports.configureServer = configureServer
exports.boot = async function () {
  await configureDatabase()
  await configureServer(httpServer, Models(mongoose))
  await httpServer.start()
  console.log(`Server started at ${httpServer.info.uri}`)
}
