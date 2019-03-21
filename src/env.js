const dotenv = require('dotenv')

module.exports = class {
  constructor() {
    // Dotenv load .env file to process.env
    dotenv.config()
  }
  get(parameter, defaultValue) {
    return process.env[parameter] || defaultValue
  }
}