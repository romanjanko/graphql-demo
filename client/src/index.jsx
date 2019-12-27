import React from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@material-ui/core'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import App from './components/app/App'

const httpLink = createHttpLink({
   uri: `http://${location.hostname}:4000`
})

const client = new ApolloClient({
   link: httpLink,
   cache: new InMemoryCache()
})

ReactDOM.render(
   <ApolloProvider client={client}>
      <CssBaseline />
      <App />
   </ApolloProvider>,
   document.querySelector('.container')
)