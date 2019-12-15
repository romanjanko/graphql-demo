const { GraphQLDateTime } = require('graphql-iso-date')

const Query = require('./query')
const Mutation = require('./mutation')
const Subscription = require('./subscription')
const Tour = require('./tour')
const Comment = require('./comment')

const resolvers = {
   Query,
   Mutation,
   Subscription,
   Tour,
   Comment,
   DateTime: GraphQLDateTime // custom scalar type
}

module.exports = resolvers
