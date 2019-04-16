module.exports = server => {
  const Anecdote = server.app.models.Anecdote

  return {
    async all (request, h) {
      const anecdotes = (await Anecdote.find()).map(a => a.getVisibleAnecdote())
      return anecdotes
    },

    async delete (request) {
      const { id } = request.params
      await Anecdote.deleteOne({ _id: id })
      return { message: 'OK' }
    }
  }
}