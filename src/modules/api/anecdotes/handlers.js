module.exports = server => {
  const Anecdote = server.app.models.Anecdote

  return {
    async all (request, h) {
      return Anecdote.find()
    }
  }
}