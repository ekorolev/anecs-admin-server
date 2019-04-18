const Boom = require('boom')

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
    },

    async create (request) {
      const {
        username,
        role
      } = request.auth.credentials.user
      const {
        text,
        status
      } = request.payload
      if (role!=='admin') return Boom.unauthorized()
      const anecdote = new Anecdote({
        text,
        status,
        author: username,
        createdAt: Date.now(),
        publishedAt: status === Anecdote.statuses.PUBLISHED ? Date.now() : undefined
      })
      await anecdote.save()
      return anecdote.getVisibleAnecdote()
    }
  }
}