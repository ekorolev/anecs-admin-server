module.exports = mongoose => ({
  Anecdote: require('./Anecdote')(mongoose),
  User: require('./User')(mongoose),
  Token: require('./Token')(mongoose)
})