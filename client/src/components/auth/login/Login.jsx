import React from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { Button, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AuthForm from '../form/AuthForm'
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../constants'

const LOGIN_MUTATION = gql`
   mutation Login($name: String!, $password: String!) {
      login(name: $name, password: $password) {
         token
      }
   }
`

const useStyles = makeStyles({   
   errors: {
      marginTop: '24px',
      fontSize: '14px',
   }
})

const Login = ({ history }) => {
   const classes = useStyles()

   const client = useApolloClient()
   
   const [ login, { loading, error } ] = useMutation(
      LOGIN_MUTATION,
      {
         onCompleted: ({ login: { token }}) => {
            localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, token)
            client.writeData({ data: { isUserLoggedIn: true } })

            history.push('/')
         }
      }
   )

   const renderContent = ({ usernameField, passwordField }) => {
      return (
         <React.Fragment>
            {usernameField}
            {passwordField}

            <Button 
               type='submit'
               variant='contained'
               color='primary'
               disabled={loading}
            >
               Log in
            </Button>

            {error && (
               <FormHelperText 
                  id="errors"
                  className={classes.errors}
                  error
               >
                  Failed to log in.
               </FormHelperText>
            )}
         </React.Fragment>
      )
   }

   const onSubmit = ({ username, password }) => {
      login({
         variables: {
            name: username,
            password
         }
      })
   }

   return (
      <AuthForm
         renderContent={renderContent}
         onSubmit={onSubmit}
      />
   )
}

export default Login