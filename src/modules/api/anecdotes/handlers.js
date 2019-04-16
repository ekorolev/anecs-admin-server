module.exports = server => {
  const Anecdote = server.app.models.Anecdote

  return {
    async all (request, h) {
      const anecdotes = (await Anecdote.find()).map(a => a.getVisibleAnecdote())
      return anecdotes
    }
  }
}