const { GraphQLServer, PubSub } = require('graphql-yoga')
const path = require('path')

const db = require('./db')
const seedDatabase = require('./db/seed')
const resolvers = require('./resolvers')

const resolvePathToSchema = relativePath => path.join(path.dirname(__filename), relativePath)

seedDatabase(db)

const pubsub = new PubSub()
const server = new GraphQLServer({
   typeDefs: resolvePathToSchema('./schema.graphql'),
   resolvers,
   context: context => ({
      ...context,
      pubsub
   })
})

module.exports = server