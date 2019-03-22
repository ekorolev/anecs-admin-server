const { Anecdote } = require('../models')

class PublishWorker {
  constructor(interval = 24 * 60 * 60 * 1000) {
    console.log(`Create worker with interval ${interval}`)
    this.lastPublication = Date.now()
    this.interval = interval
    this.worker = null
  }

  async publicAnecdote() {
    const anec = await Anecdote.findOne({ status: Anecdote.statuses.FOR_PUBLICATION })
    if (anec) {
      anec.status = Anecdote.statuses.PUBLISHED
      anec.publishedAt = Date.now()
      await anec.save()
      console.log(`Anec ${anec._id} published`)
    } else {
      console.log(`There aren't any anecdotes for publication`)
    }
  }

  start() {
    this.worker = setInterval(() => {
      this.publicAnecdote()
    }, this.interval)
  }

  stop() {
    if (!this.worker) return
    clearInterval(this.worker)
  }
}

module.exports = PublishWorker