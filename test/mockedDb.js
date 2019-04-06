const mongoUnit = require('mongo-unit')
const mongoose = require('mongoose')
const Models = require('../src/models')
const createConnection = (mongoose, url) => new Promise((resolve, reject) => {
  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  mongoose.connection.once('open', resolve)
})

const state = {
  connections: 2,
  mongoUrl: null,
  promise: null,
  models: null
}

exports.connect = async () => {
  if (!state.mongoUrl) {
    state.mongoUrl = await mongoUnit.start()
    state.promise = createConnection(mongoose, state.mongoUrl)
    state.models = Models(mongoose)
  }
  await state.promise
  return state.models
}

exports.disconnect = async () => {
  if (!--state.connections) {
    state.mongoUrl = null
    await mongoose.disconnect()
    await mongoUnit.stop()
  }
}