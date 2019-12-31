import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import Header from './header/Header'
import Login from './auth/login/Login'
import Signup from './auth/signup/Signup'
import Tour from './tour/Tour'
import ToursList from './toursList/ToursList'

const useStyles = makeStyles({
   container: {
      paddingBottom: '80px'
   }
})

const App = () => {
   const classes = useStyles()

   return (
      <BrowserRouter>
         <React.Fragment>
            <Header />
            <Container className={classes.container}>
               <Switch>
                  <Route path='/login' component={Login} />
                  <Route path='/signup' component={Signup} />
                  <Route path='/tour/:id' component={Tour} />
                  <Route path='/' component={ToursList} />
               </Switch>
            </Container>
         </React.Fragment>
      </BrowserRouter>
   )
}

export default App