import React,{useState,useEffect} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { AddProducts } from './Components/AddProducts'
import {NotFound} from './Components/NotFound'
import {Signup} from './Components/Signup'
import {Login} from './Components/Login'
import { Home } from './Components/Home'
import {fs} from './Config/Config'

function GetDataFromFirestore(){  
  const [products, setProducts]=useState([]);
  useEffect(()=>{   
    const unsubscribe = fs.collection('Products').onSnapshot(snapshot=>{
      const newProduct = snapshot.docs.map(doc=>({
        ID: doc.id,
        ...doc.data()
      }))
      setProducts(newProduct);
    })
    return () => unsubscribe()
  },[])
  return products
}

export const App = () => {

  const data = GetDataFromFirestore();
  console.log(data); 
  
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={()=><Home/>}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/login" component={Login}/>
        <Route path="/add-products" component={()=><AddProducts/>}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  )
}
export default App