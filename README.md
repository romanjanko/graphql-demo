# GraphQL Demo
The app shows a list of ski destinations, it is possible to sign up/log in and add comments.
The whole purpose of the app is just to try out GraphQL. The project consists of two parts - 
server and client.

## Server
Written in node.js using graphql-yoga. It uses JSON DB to store data. For better testing, data
added by users are deleted on every server's restart.

To run server:

`cd ./server`

`npm i`

`npm run start`

The server will start on http://localhost:4000 (you can access GraphQL Playground here).

## Client
Written in React and Apollo.

To run client:

`cd ./client`

`npm i`

`npm run start`

The client will start on http://localhost:8080/. You can log in with following credentials: 
Username 'user' and Password '1234'.

