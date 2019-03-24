const Hapi = require('hapi')
const mongoose = require('mongoose')
const path = require('path')
const routes = require('./routes')
const cors = require('hapi-cors')
const Workers = require('./workers')
require('dotenv').config()
const publishWorker = new Workers.PublishWorker(process.env.PUBLISING_INTERVAL)

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })

mongoose.connection.once('open', () => {
  console.log('connected to database')
  publishWorker.start()
})

const server = Hapi.server({
  port: process.env.PORT,
  host: process.env.HOST,
})

const init = async () => {
  await server.register({
    plugin: cors,
    options: {
      headers: ['Accept', 'Content-Type', 'Token']
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