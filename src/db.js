const { MongoClient } = require('mongodb')

module.exports = class {
  constructor(env) {
    this.env = env
    this.mongo_url = env.get('MONGO_CONNECTION', 'mongodb://localhost:27017')
    this.mongo_database = env.get('MONGO_DATABASE', 'anecs-database')
  }

  async init() {
    const client = await MongoClient.connect(
      this.mongo_url,
      {
        useNewUrlParser: true
      }
    )
    this._db = client.db(this.mongo_database)
  }

  get db() { return this._db }
}