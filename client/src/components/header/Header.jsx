import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Container, AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../auth/constants'

const IS_USER_LOGGED_IN = gql`
   {
      isUserLoggedIn @client
   }
`

const useStyles = makeStyles({
   toolbar: {
      padding: 0
   },
   title: {
      marginRight: 'auto',
      textDecoration: 'none',
      color: 'inherit'
   },
   loginButton: {
      marginRight: '8px'
   }
})

const Header = () => {
   const classes = useStyles()

   const {
      client,
      data: {
         isUserLoggedIn
      } = {}
   } = useQuery(IS_USER_LOGGED_IN)

   const logout = () => {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_TOKEN_KEY)
      client.writeData({ data: { isUserLoggedIn: false } })
   }

   return (
      <AppBar position='static'>
         <Container>
            <Toolbar className={classes.toolbar}>
               <Typography
                  component={Link}
                  to='/'
                  variant='h6'
                  className={classes.title}
               >
                  GraphQL Demo
               </Typography>
               {isUserLoggedIn ? (
                  <Button
                     color='inherit'
                     onClick={logout}
                  >
                     Log out
                  </Button>
               ) : (
                     <React.Fragment>
                        <Button
                           component={Link}
                           to='/login'
                           color='inherit'
                           className={classes.loginButton}
                        >
                           Log in
                        </Button>
                        <Button
                           component={Link}
                           to='/signup'
                           color='inherit'
                        >
                           Sign up
                        </Button>
                     </React.Fragment>
                  )}
            </Toolbar>
         </Container>
      </AppBar>
   )
}

export default Header