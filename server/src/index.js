const { GraphQLServer } = require('graphql-yoga')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
  comments: [{
    id: 1,
    text: 'What an awesome destination!'
  }]
}]

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

const resolvers = {
  Query: {
    tours: () => tours
  },
  Mutation: {
    addComment: (parent, args) => {
      const { tourId, text } = args
      const tour = tours.find(t => t.id === Number(tourId))

      if (tour) {
        const { comments } = tour
        const comment = {
          id: comments.length + 1,
          text
        }

        comments.push(comment)

        return comment
      } else {
        throw new Error(`Tour with id ${tourId} not found!`)
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
  }
  // Tour: {
  //   id: parent => parent.id,
  //   name: parent => parent.name,
  //   description: parent => parent.description,
  //   price: parent => parent.price,
  //   transport: parent => parent.transport
  // }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))