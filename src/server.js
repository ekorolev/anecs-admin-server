const Hapi = require('hapi')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const routes = require('./routes')
const cors = require('hapi-cors')
const Workers = require('./workers')
require('dotenv').config()
const publishWorker = new Workers.PublishWorker(process.env.PUBLISING_INTERVAL)
let tls = {}
if (process.env.HTTPS) {
  tls.key = fs.readFileSync(process.env.PK_PATH, 'utf8')
  tls.cert = fs.readFileSync(process.env.CERT_PATH, 'utf8')
}


mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true })

mongoose.connection.once('open', () => {
  console.log('connected to database')
  publishWorker.start()
})

const httpServer = new Hapi.Server({
  host: '0.0.0.0',
  port: process.env.PORT
})
let httpsServer = null
if (process.env.HTTPS) {
  httpsServer = new Hapi.Server({
    host: '0.0.0.0',
    port: 444,
    tls
  })
}

const init = async (serv) => {
  await serv.register({
    plugin: cors,
    options: {
      headers: ['Accept', 'Content-Type', 'Token']
    }
    
  })
  serv.route(routes)

  await serv.start()
  console.log(`Server running at: ${serv.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

module.exports = async function () {
  await init(httpServer)
  if (process.env.HTTPS) {
    await init(httpsServer)
  }
}