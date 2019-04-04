const Hapi = require('hapi')
const mongoose = require('mongoose')
const cors = require('hapi-cors')
require('dotenv').config()
const Models = require('./models')

const httpServer = new Hapi.Server({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT
})

const init = async (serv) => {
  const mongoConnect = () => new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
      useCreateIndex: true
    })
    mongoose.connection.once('open', resolve)
    mongoose.connection.once('error', reject)
  })

  await mongoConnect()
  await serv.register({
    plugin: cors,
    options: {
      headers: ['Accept', 'Content-Type', 'Token']
    }
  })

  // add models to app
  serv.app.models = mongoose.models

  await serv.register(require('./modules/auth'))
  await serv.register(require('./modules/api'))

  await serv.start()
  console.log(`Server running at: ${serv.info.uri}`)
}

module.exports = async function () {
  await init(httpServer)
}