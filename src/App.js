import React,{useState,useEffect} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { AddProducts } from './Components/AddProducts'
import {NotFound} from './Components/NotFound'
import {Signup} from './Components/Signup'
import {Login} from './Components/Login'
import { Home } from './Components/Home'
import { Cart } from './Components/Cart'
import {fs,auth} from './Config/Config'
import CartContextProvider from './Global/CartContext'

// getting current user
function GetCurrentUser(){
  const [user,setUser]=useState(null);
  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged(user=>{
      if(user){
        fs.collection('users').doc(user.uid).get().then(snapshot=>{
          setUser(snapshot.data().FullName);
        })
      }
      else{
        console.log('user is not logged in to retrive user');
        setUser(null);
      }
    })
    return () => unsubscribe && unsubscribe()   
  },[])
  return user
}

export const App = () => {

  const user = GetCurrentUser();
  // console.log(user);

  return (
    <CartContextProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={()=><Home user={user}/>}/>
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/add-products" component={()=><AddProducts/>}/>
          <Route path='/cart' component={()=><Cart user={user}/>}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    </CartContextProvider>
  )
}
export default App