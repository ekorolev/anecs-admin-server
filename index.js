const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { 
  getAnecdotes,
  createAnecdote,
  getAnecdotesCount
} = require('./routes/anecdotes')
require('dotenv').config()

const port = process.env.PORT
const mongo_url = process.env.MONGO_CONNECTION
const mongo_db = process.env.MONGO_DATABASE

const boot = async () => {
  const app = express()
  const client = await MongoClient.connect(
    mongo_url, 
    {
      useNewUrlParser: true
    }
  )
  const db = client.db(mongo_db)
  
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
  })
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static(path.join(__dirname, 'public')))

  app.get('/anecdotes', getAnecdotes(db))
  app.get('/anecdotes/count', getAnecdotesCount(db))
  app.post('/anecdotes/create', createAnecdote(db))

  app.listen(port, () => console.log(`Server started at port ${port}`))
}

boot()