const server = require('./app/server')

server.start(() => console.log(`Server is running on http://localhost:4000`))