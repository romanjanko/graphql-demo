const { GraphQLServer, PubSub } = require('graphql-yoga')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { GraphQLDateTime } = require('graphql-iso-date')
const getUserId = require('./auth/getUserId')
const APP_SECRET = require('./auth/constants')
const db = require('./db')
const seedDatabase = require('./db/seed')

const TOURS_ORDER_BY_NAME_ASC = 'nameAsc'
const TOURS_ORDER_BY_NAME_DESC = 'nameDesc'
const TOURS_ORDER_BY_PRICE_ASC = 'priceAsc'
const TOURS_ORDER_BY_PRICE_DESC = 'priceDesc'

const NEW_COMMENT_CHANNEL_NAME = 'NEW_COMMENT'

const TOURS_BY_PAGE = 12

const resolvers = {
  Query: {
    tours: (parent, args) => {
      const { filter = '', orderBy, page: pageArg = 0 } = args
      const page = Number(pageArg)

      const applyFilter = tour =>
        tour.name.toLowerCase().includes(filter.toLowerCase())

      const applyOrderBy = (tourA, tourB) => {
        const orderByNameAsc = () => tourA.name > tourB.name
        const orderByNameDesc = () => tourA.name < tourB.name
        const orderByPriceAsc = () => tourA.price > tourB.price
        const orderByPriceDesc = () => tourA.price < tourB.price

        switch (orderBy) {
          case TOURS_ORDER_BY_NAME_ASC:
            return orderByNameAsc()
          case TOURS_ORDER_BY_NAME_DESC:
            return orderByNameDesc()
          case TOURS_ORDER_BY_PRICE_ASC:
            return orderByPriceAsc()
          case TOURS_ORDER_BY_PRICE_DESC:
            return orderByPriceDesc()
          default:
            return orderByNameAsc()
        }
      }

      const tours = db.getData('/tours')

      return tours
        .filter(applyFilter)
        .slice(page * TOURS_BY_PAGE, page * TOURS_BY_PAGE + TOURS_BY_PAGE)
        .sort(applyOrderBy)
    },
    tour: (parent, args) => {
      const tourId = Number(args.tourId)
      const tours = db.getData('/tours')
      return tours.find(t => t.id === tourId)
    }
  },
  Mutation: {
    addComment: (parent, args, context) => {
      const userId = getUserId(context)

      const users = db.getData('/users')

      // TODO better check for valid user
      if (userId && users.length) {
        const { text } = args
        const tourId = Number(args.tourId)
        const tours = db.getData('/tours')
        const tour = tours.find(t => t.id === tourId)

        if (tour) {
          const { comments: tourComments } = tour

          const comments = db.getData('/comments')

          const comment = {
            id: comments.length + 1,
            text,
            createdBy: userId,
            createdAt: new Date(),
            tour: tourId
          }

          db.push('/comments', [ comment ], false)
          tourComments.push(comment.id)


          context.pubsub.publish(NEW_COMMENT_CHANNEL_NAME, {
            newComment: comment
          })

          return comment
        } else {
          throw new Error(`Tour with id ${tourId} not found!`)
        }
      } else {
        throw new Error(`Not authenticated.`)
      }
    },
    signup: async (parent, args) => {
      const users = db.getData('/users')

      if (users.find(u => u.name === args.name)) {
        throw new Error('User with same name already exists.')
      }

      const password = await bcrypt.hash(args.password, 10)

      const user = {
        ...args,
        id: users.length + 1,
        password
      }

      db.push('/users', [ user ], false)

      const token = jwt.sign({ userId: user.id }, APP_SECRET)

      return {
        token,
        user
      }
    },
    login: async (parent, args) => {
      const { name } = args

      const users = db.getData('/users')
      const user = users.find(u => u.name === name)

      if (!user) {
        throw new Error('No such user found.')
      }

      const valid = await bcrypt.compare(args.password, user.password)

      if (!valid) {
        throw new Error('Invalid password.')
      }

      const token = jwt.sign({ userId: user.id }, APP_SECRET)

      return {
        token,
        user
      }
    }
  },
  Subscription: {
    newComment: {
      subscribe: (parent, args, context) => {
        return context.pubsub.asyncIterator(NEW_COMMENT_CHANNEL_NAME)
      }
    }
  },
  Tour: {
    comments: (parent, args) => {
      const { comments: commentsIds = [] } = parent
      const comments = db.getData('/comments')
      return comments.filter(c => commentsIds.includes(c.id))
    }
  },
  Comment: {
    // for fields with direct 1:1 mapping, it is not necessary to write:
    // id: parent => parent.id,
    createdBy: (parent, args) => {
      const { createdBy: userId } = parent

      const users = db.getData('/users')
      const user = users.find(u => u.id === userId)

      return user
    },
    tour: (parent, args) => {
      const { tour: tourId } = parent
      const tours = db.getData('/tours')
      const tour = tours.find(t => t.id === tourId)

      return tour
    }
  },
  DateTime: GraphQLDateTime // custom scalar type
}

seedDatabase(db)

const server = new GraphQLServer({
  typeDefs: './src/app/schema.graphql',
  resolvers,
  context: context => ({
    ...context,
    pubsub: new PubSub()
  })
})

module.exports = server