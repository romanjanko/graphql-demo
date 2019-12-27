import React from 'react'
import { Link } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

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
            </Toolbar>
         </Container>
      </AppBar>
   )
} 

export default Header