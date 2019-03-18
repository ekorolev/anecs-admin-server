const express = require('express')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const { 
  getAnecdotes,
  createAnecdote
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
  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  app.get('/anecdotes', getAnecdotes(db))
  app.post('/anecdotes/create', createAnecdote(db))

  app.listen(port, () => console.log(`Server started at port ${port}`))
}

boot()