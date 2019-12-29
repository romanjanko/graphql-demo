import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Container } from '@material-ui/core'

import Header from './header/Header'
import Login from './auth/login/Login'
import Signup from './auth/signup/Signup'
import Tour from './tour/Tour'
import ToursList from './toursList/ToursList'

const App = () => (
   <BrowserRouter>
      <React.Fragment>
         <Header />
         <Container>
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

export default App