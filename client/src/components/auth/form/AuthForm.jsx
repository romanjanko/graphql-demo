import React, { useState } from 'react'
import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({   
   root: {
      display: 'inline-flex',
      flexDirection: 'column',
      maxWidth: '350px',
      width: '100%',
      margin: '16px 0'
   },
   username: {
      marginBottom: '16px'
   },
   password: {
      marginBottom: '32px'
   }
})

const AuthForm = (props) => {
   const classes = useStyles()

   const [ username, setUsername ] = useState()
   const [ password, setPassword ] = useState()

   const onSubmit = event => {
      event.preventDefault()
      props.onSubmit({
         username,
         password
      })
   }

   const renderedUsernameField = (
      <TextField 
         id='username'
         className={classes.username}
         label='Username'
         required 
         onChange={e => setUsername(e.target.value)}
      />
   )
   
   const renderedPasswordField = (
      <TextField 
         id='password'
         className={classes.password}
         type='password'
         label='Password' 
         required
         onChange={e => setPassword(e.target.value)}
      />
   )

   return (
      <form 
         className={classes.root}
         onSubmit={onSubmit}
      >
         {props.renderContent({
            usernameField: renderedUsernameField,
            passwordField: renderedPasswordField
         })}
      </form>
   )
}

export default AuthForm