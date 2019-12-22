import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@material-ui/core'

import App from './components/app/App'
 
ReactDOM.render(
   <BrowserRouter>
      <React.Fragment>
         <CssBaseline />
         <App />
      </React.Fragment>
   </BrowserRouter>,
   document.querySelector('.container')
)