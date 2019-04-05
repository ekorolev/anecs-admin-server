const Hapi = require('hapi')
const mongoose = require('mongoose')
const cors = require('hapi-cors')
require('dotenv').config()
const Models = require('./models')

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
      headers: ['Accept', 'Content-Type', 'Authentication']
    }
  })
  server.app.models = models
  await server.register(require('./modules/auth'))
  await server.register(require('./modules/api'))
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
  await configureServer(httpServer, Models)
  await httpServer.start()
  console.log(`Server started at ${httpServer.info.uri}`)
}