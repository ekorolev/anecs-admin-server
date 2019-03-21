const Container = require('./ioc_container')

const boot = async () => {
  await Container.get('db').init()
  await Container.get('server').listen()
}

// Start the application if index.js was called by command line
if ( require.main === module ) {
  boot()
}

module.exports = boot