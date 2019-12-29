import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import { Button, TextField, FormHelperText } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { LOCAL_STORAGE_AUTH_TOKEN_KEY } from '../constants'

const LOGIN_MUTATION = gql`
   mutation Login($name: String!, $password: String!) {
      login(name: $name, password: $password) {
         token
      }
   }
`

const useStyles = makeStyles({   
   root: {
      display: 'inline-flex',
      flexDirection: 'column',
      maxWidth: '350px',
      width: '100%',
      margin: '32px 0'
   },
   errors: {
      marginTop: '24px',
      fontSize: '14px',
   },
   username: {
      marginBottom: '16px'
   },
   password: {
      marginBottom: '32px'
   }
})

const Login = ({ history }) => {
   const classes = useStyles()

   const [ username, setUsername ] = useState()
   const [ password, setPassword ] = useState()

   const client = useApolloClient()
   
   const [ login, { loading, error } ] = useMutation(
      LOGIN_MUTATION,
      {
         variables: {
            name: username,
            password
         },
         onCompleted: ({ login: { token }}) => {
            localStorage.setItem(LOCAL_STORAGE_AUTH_TOKEN_KEY, token)
            client.writeData({ data: { isUserLoggedIn: true } })

            history.push('/')
         }
      }
   )

   const onSubmit = event => {
      event.preventDefault()
      login()
   }

   return (
      <form 
         className={classes.root}
         onSubmit={onSubmit}
      >
         <TextField 
            id='username'
            className={classes.username}
            label='Username'
            required 
            onChange={e => setUsername(e.target.value)}
         />
         <TextField 
            id='password'
            className={classes.password}
            type='password'
            label='Password' 
            required
            onChange={e => setPassword(e.target.value)}
         />
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
      </form>
   )
}

export default Login