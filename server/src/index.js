const { GraphQLServer } = require('graphql-yoga')

const typeDefs = `
type Query {
  info: String!,
  tours: [Tour!]!
}

type Tour {
  id: ID!,
  name: String!,
  description: String,
  price: Float!,
  transport: String
}
`

const tours = [{
  id: 1,
  name: 'Bad Kleinkirchheim',
  description: 'Austria',
  price: 1000,
  transport: 'Own'
}, {
  id: 2,
  name: 'Saalbach',
  description: 'Austria',
  price: 1100,
  transport: 'Bus'
}]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    tours: () => tours
  },
  // Tour: {
  //   id: parent => parent.id,
  //   name: parent => parent.name,
  //   description: parent => parent.description,
  //   price: parent => parent.price,
  //   transport: parent => parent.transport
  // }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => console.log(`Server is running on http://localhost:4000`))