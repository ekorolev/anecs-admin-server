const { 
  ContainerBuilder, 
  Reference 
} = require('node-dependency-injection')
const Server = require('./src/server')
const Controllers = require('./src/controllers')
const Env = require('./src/env')
const Database = require('./src/db')

const container = new ContainerBuilder()

// Register environment variables module
container
  .register('env', Env)
  .addArgument()

// Register a sequelize instance
container
  .register('db', Database)
  .addArgument(new Reference('env'))

// Register controllers
container
  .register('controllers', Controllers)
  .addArgument(new Reference('env'))
  .addArgument(new Reference('db'))

// Register server
container
  .register('server', Server)
  .addArgument(new Reference('env'))
  .addArgument(new Reference('db'))
  .addArgument(new Reference('controllers'))

module.exports = container