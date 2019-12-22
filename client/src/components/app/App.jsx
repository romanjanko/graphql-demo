import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'

import Header from '../header/Header'
import Login from '../login/Login'
import Signup from '../signup/Signup'
import Tour from '../tour/Tour'
import ToursList from '../toursList/ToursList'

const App = () => (
   <React.Fragment>
      <Header />
      <Container>
         <Switch>
            <Route path='/login'>
               <Login />
            </Route>
            <Route path='/signup'>
               <Signup />
            </Route>
            <Route path='/tour/:id'>
               <Tour />
            </Route>
            <Route path='/'>
               <ToursList />
            </Route>
         </Switch>
      </Container>
   </React.Fragment>
)

export default App