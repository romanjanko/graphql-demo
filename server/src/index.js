const { GraphQLServer } = require('graphql-yoga')

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