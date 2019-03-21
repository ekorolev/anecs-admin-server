const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

module.exports = class {
  constructor(env, db, controllers) {
    this.env = env
    this.db = db
    this.controllers = controllers
    this.port = this.env.get('PORT', 3000)
    this.app = express()
  
    this.configure()
  }

  configure() {
    const app = this.app

    app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
      res.header('Access-Control-Allow-Headers', 'Content-Type')
      next()
    })
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.static(path.join(__dirname, 'public')))
  
    this.route('get', '/anecdotes', 'getAnecdotes')
    this.route('get', '/anecdotes/count', 'getAnecdotesCount')
    this.route('post', '/anecdotes/create', 'createAnecdote')
  }

  route(method, route, controller) {
    const self = this
    self.app[method](route, function () {
      return self.controllers[controller].apply(self.controllers, arguments)
    })
  }

  listen() {
    return this.app.listen(this.port, () => console.log(`Server started at port ${this.port}`))
  }
}