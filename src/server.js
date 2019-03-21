const Hapi = require('hapi')
const mongoose = require('mongoose')
const anecdotes = require('./models/Anecdotes')
const crypto = require('crypto')
const path = require('path')
const inert = require('inert')
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
  server.route([
    {
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: '.',
          redirectToSlash: true,
          index: true,
        }
      }
    },
    {
      method: 'GET',
      path: '/anecdotes',
      handler: async (req) => {
        const findOptions = {}
        let {
          before, size
        } = req.query
        if (before) {
          findOptions.createdAt = { $lt: parseInt(before) }
        }
        size = size ? parseInt(size) : 10
        const anecs = await anecdotes.find(findOptions).sort({ createdAt: -1 }).limit(size)
        const count = await anecdotes.countDocuments(findOptions)
        return {
          anecdotes: anecs,
          count
        }
      }
    },
    {
      method: 'GET',
      path: '/anecdotes/count',
      handler: () => {
        return anecdotes.countDocuments()
      }
    },
    {
      method: 'POST',
      path: '/anecdotes/create',
      handler: async (req, reply) => {
        const hmac_secret = process.env.HMAC_SECRET
        const compareHash = process.env.COMPARE_HASH
        const {
          secretCode,
          text,
          author
        } = req.payload

        if (!secretCode) {
          reply.code(401)
          return { error: 'Access denied' }
        }

        const hash = crypto.createHmac('sha256', hmac_secret)
          .update(secretCode)
          .digest('hex')

        if (hash !== compareHash) {
          reply.code(401)
          return{ error: 'Access denied' }
        }
      
        const anecdote = new anecdotes({
          createdAt: Date.now(),
          text,
          author
        })
        await anecdote.save()
        return { message: 'OK', anecdote }
      }
    }
  ])

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

module.exports = init