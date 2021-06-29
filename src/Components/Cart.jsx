import React from 'react'
import { Navbar } from './Navbar'
import {CartProducts} from './CartProducts'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import {auth,fs} from '../Config/Config'
import {useHistory} from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const Cart = ({user,cartProducts,productIncrease,productDecrease,
   totalQty, TotalPrice}) => {
       
    const history = useHistory();
   
    // console.log(cartProducts);
    // console.log(totalQty);
    // console.log(TotalPrice);   
    
    const handleToken= async (token) => {
        // console.log(token);
        const cart = {name: 'All products', TotalPrice}
        const response = await axios.post("http://localhost:8080/checkout",{
            cart,
            token
        });
        // console.log(response);
        let {status}=response.data;
        if(status==='success'){
            history.push('/');
            toast.success('Your order has been placed successfully',{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('Cart ' + user.uid).onSnapshot(snapshot=>{
                        snapshot.docs.forEach((doc)=>{
                            fs.collection('Cart ' + user.uid).doc(doc.id).delete().then(()=>{
                                setTimeout(()=>{
                                    window.location.reload('/');
                                },7000)                                                                                                  
                            })
                        })
                    })                       
                }
            })       
        }
        else{
            alert('something went wrong in checkout. Please try again');
        }
    }  

    return (
        <>
            <Navbar user={user} totalQty={totalQty}/>
            <br></br>
            {cartProducts.length>0&&<div className='container-fluid'>
                <h1 className='text-center'>Cart</h1>
                <div className='products-box'>
                    <CartProducts cartProducts={cartProducts}
                        productIncrease={productIncrease}
                        productDecrease={productDecrease}                        
                    />
                </div>
                <div className='summary-box'>
                    <h5>Cart Summary</h5>
                    <br></br>                
                    <div>Total No of Products: <span>{totalQty}</span></div>
                    <div>Total Price to Pay: <span>$ {TotalPrice}</span></div>
                    <br></br>
                    <StripeCheckout
                        stripeKey="pk_test_51Hhu6bK4kL4WRmvGEUkTmdFw1lUtTAnadBSDb0eXGuA2JJGrntIBdm10llYu5RbPbLbaS1My74Rgdi0n5ePYIGB600p3V4GKmK"
                        token={handleToken}
                        billingAddress
                        shippingAddress
                        amount={TotalPrice*100}
                        name="All Products"
                    ></StripeCheckout>
                </div>                
            </div>}           
            {cartProducts.length < 1&&<div className='container-fluid'>No products to show</div>}            
        </>
    )
}