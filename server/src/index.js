const { GraphQLServer, PubSub } = require('graphql-yoga')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { GraphQLDateTime } = require('graphql-iso-date')

const tours = [{
  id: 1,
  name: 'Bad Kleinkirchheim',
  description: 'Austria',
  price: 1000,
  transport: 'Own',
  comments: []
}, {
  id: 2,
  name: 'Saalbach',
  description: 'Austria',
  price: 1100,
  transport: 'Bus',
  comments: []
}]

const comments = []

const users = []

const APP_SECRET = 'something_that_is_really_secret'
function getUserId(context) {
  const authorizationHeader = context.request.get('Authorization')

  if (authorizationHeader) {
    const token = authorizationHeader.replace('Bearer ', '')
    const { userId } = jwt.verify(token, APP_SECRET)
    return userId
  }

  throw new Error('Not authenticated.')
}

const NEW_COMMENT_CHANNEL_NAME = 'NEW_COMMENT'

const resolvers = {
  Query: {
    tours: () => tours,
    tour: (parent, args) => {
      const tourId = Number(args.tourId)
      return tours.find(t => t.id === tourId)
    }
  },
  Mutation: {
    addComment: (parent, args, context) => {
      const userId = getUserId(context)

      if (userId && users.length) {
        const { text } = args
        const tourId = Number(args.tourId)
        const tour = tours.find(t => t.id === tourId)
  
        if (tour) {
          const { comments: tourComments } = tour
          const comment = {
            id: comments.length + 1,
            text,
            createdBy: userId,
            createdAt: new Date(),
            tour: tourId
          }
  
          comments.push(comment)
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
      if (users.find(u => u.name === args.name)) {
        throw new Error('User with same name already exists.')
      }

      const password = await bcrypt.hash(args.password, 10)

      const user = { 
        ...args, 
        id: users.length + 1,
        password
      }
      users.push(user)

      const token = jwt.sign({ userId: user.id }, APP_SECRET)
    
      return {
        token,
        user
      }
    },
    login: async (parent, args) => {
      const { name } = args

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
      return comments.filter(c => commentsIds.includes(c.id))
    }
  },
  Comment: {
    // for fields with direct 1:1 mapping, it is not necessary to write:
    // id: parent => parent.id,
    createdBy: (parent, args) => {
      const { createdBy: userId } = parent
      const user = users.find(u => u.id === userId)
      
      return user
    },
    tour: (parent, args) => {
      const { tour: tourId } = parent
      const tour = tours.find(t => t.id === tourId)

      return tour
    }
  },
  DateTime: GraphQLDateTime // custom scalar type
}

const pubsub = new PubSub()

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: context => ({
    ...context,
    pubsub
  })
})

server.start(() => console.log(`Server is running on http://localhost:4000`))