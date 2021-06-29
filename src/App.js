import React,{useState,useEffect,useCallback} from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { AddProducts } from './Components/AddProducts'
import {NotFound} from './Components/NotFound'
import {Signup} from './Components/Signup'
import {Login} from './Components/Login'
import { Home } from './Components/Home'
import { Cart } from './Components/Cart'
import {fs,auth} from './Config/Config'

// getting current user function
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
   
  // getting current user
  const user = GetCurrentUser();
  // console.log(user);   
 
  // state of cart products
  const [cartProducts, setCartProducts]=useState([]);
  console.log(cartProducts); 
 
  // getting the qty from cartProducts in a separate array
  const qty = cartProducts.map(cartProduct=>{
    return cartProduct.qty
  })

  // reducing the qty in a single value : Qty
  const reducerOfQty = (accumulator, currentValue) => accumulator + currentValue;
  const totalQty = qty.reduce(reducerOfQty,0);
  console.log('Qty:'+totalQty);
  
  // getting the prices from cartProducts in a separate array
  const totalPrice = cartProducts.map(cartProduct=>{
    return cartProduct.TotalProductPrice
  })

  // reducing the price in a single value : TotalPrice
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const TotalPrice = totalPrice.reduce(reducer,0);
  console.log('TotalPrice:'+TotalPrice);  
  
  // getting cart products and update the cartProducts state
  useEffect(()=>{       
    auth.onAuthStateChanged(user=>{
      if(user){        
        fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{            
          const newCartProduct=snapshot.docs.map(doc=>({
            ID:doc.id,
            ...doc.data()
          }))          
          setCartProducts(newCartProduct);                    
        })      
      }
      else{
        console.log('user is not logged in retrive cart');
      }
    })
  },[])
  
  // defining variables
  let Product;

  // add to cart    
  const addToCart=useCallback((product)=>{
    const check = cartProducts.find((myProduct)=>myProduct.ID===product.ID)
    if(check){
      console.log('match found');
    }
    else{
      Product=product;
      Product['qty']=1;
      Product['TotalProductPrice']=Product.qty * Product.price
      // setCartProducts([...cartProducts,Product]);  
      auth.onAuthStateChanged(user=>{
        if(user){
          fs.collection('Cart ' + user.uid).doc(product.ID).set(Product).then(()=>{
            console.log('successfully added to cart');
          });
        }       
      })
    }
  },[])    
   
  // product increase
  const productIncrease=(cartProduct)=>{
    Product = cartProduct;
    Product.qty = Product.qty+1;
    Product.TotalProductPrice=Product.qty*Product.price;
    // setCartProducts([...cartProducts]);
    //updating in database
    auth.onAuthStateChanged(user=>{
      if(user){
        fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
          console.log('increment added');
        });
      }
      else{
        console.log('user is not logged in to increment');
      }
    })
  }

  // product decrease
  const productDecrease=(cartProduct)=>{
    Product = cartProduct;
    if(Product.qty>1){
      Product.qty = Product.qty-1;
      Product.TotalProductPrice=Product.qty*Product.price;
    }    
    // setCartProducts([...cartProducts]);
    //updating in database
    auth.onAuthStateChanged(user=>{
      if(user){
        fs.collection('Cart ' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
          console.log('decrement');
        });
      }
      else{
        console.log('user is not logged in to increment');
      }
    })
  } 
  
  return (  
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={()=><Home user={user} addToCart={addToCart}
          totalQty={totalQty}/>}            
          />
          <Route path="/signup" component={Signup}/>
          <Route path="/login" component={Login}/>
          <Route path="/add-products" component={()=><AddProducts/>}/>
          <Route path='/cart' component={()=><Cart user={user} productIncrease={productIncrease}
            productDecrease={productDecrease}
            cartProducts={cartProducts}
            totalQty={totalQty}
            TotalPrice={TotalPrice}                 
          />}/>
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>    
  )
}

export default App