const mongoose = require('mongoose')
const { Anecdote } = require('../src/models')

const script = () => {
  const connection_string = process.argv[2]
  mongoose.connect(connection_string, { useNewUrlParser: true })
  mongoose.connection.once('open', async () => {
    const anecs = await Anecdote.find({ publishedAt: null })
    await Promise.all(anecs.map(async anec => {
      anec.publishedAt = anec.createdAt
      anec.status = 'PUBLISHED'
      await anec.save()
      console.log(`update ${anec._id} anec`)
    }))
    console.log(`Done, updated ${anecs.length} anecs`)
  })
}

script()