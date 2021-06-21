import React,{createContext,useReducer,useState,useEffect} from 'react'
import {CartReducer} from './CartReducer'
import {fs,auth} from '../Config/Config'

export const CartContext=createContext();

// getting data of cart
function GetDataOfCart(){
    const [cartProducts, setCartProducts]=useState([]);
    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                    const newCartProduct = snapshot.docs.map((doc)=>({
                        ID: doc.id,
                        ...doc.data()
                    }))
                    setCartProducts(newCartProduct);
                })
            }
            else{
                console.log('user is not signed in to retrive cart');
            }
        })
    },[])
    return cartProducts
}

const CartContextProvider=(props)=>{    
   
    const data = GetDataOfCart();
    console.log(data);   

    const [cart,dispatch] = useReducer(CartReducer,
        {shoppingCart:data,totalPrice:0,totalQty:0})
    console.log(cart);    
   
    return(
        <CartContext.Provider value={{cart,dispatch}}>
            {props.children}
        </CartContext.Provider>
    )
}

export default CartContextProvider