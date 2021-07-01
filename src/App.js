import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { AddProducts } from './Components/AddProducts'
import {NotFound} from './Components/NotFound'
import {Signup} from './Components/Signup'
import {Login} from './Components/Login'
import { Home } from './Components/Home'
import { Cart } from './Components/Cart'

export const App = () => {    
  
  return (  
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/add-products" component={AddProducts}/>
          <Route path='/cart' component={Cart}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>    
  )
}

export default App