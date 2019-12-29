import React from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline } from '@material-ui/core'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'

import App from './components/App'
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from './components/auth/constants'

const httpLink = createHttpLink({
   uri: `http://${location.hostname}:4000`
})

const authLink = setContext((_, { headers }) => {
   const token = localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)

   return {
      headers: {
         ...headers,
         Authorization: token ? `Bearer ${token}` : ''
      }
   }
})

const cache = new InMemoryCache()

cache.writeData({
   data: {
      isUserLoggedIn: !!localStorage.getItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
   }
})

const client = new ApolloClient({
   link: authLink.concat(httpLink),
   cache
})

ReactDOM.render(
   <ApolloProvider client={client}>
      <CssBaseline />
      <App />
   </ApolloProvider>,
   document.querySelector('.container')
)