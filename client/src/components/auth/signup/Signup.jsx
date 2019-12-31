import React from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { Button, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import AuthForm from '../form/AuthForm'
import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../constants'

const SIGNUP_MUTATION = gql`
   mutation Signup($name: String!, $password: String!) {
      signup(name: $name, password: $password) {
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

const Signup = ({ history }) => {
   const classes = useStyles()

   const client = useApolloClient()
   
   const [ signup, { loading, error } ] = useMutation(
      SIGNUP_MUTATION,
      {
         onCompleted: ({ signup: { token }}) => {
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
               Sign up
            </Button>
            
            {error && (
               <FormHelperText 
                  id="errors"
                  className={classes.errors}
                  error
               >
                  Failed to sign up.
               </FormHelperText>
            )}
         </React.Fragment>
      )
   }

   const onSubmit = ({ username, password }) => {
      signup({
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

export default Signup