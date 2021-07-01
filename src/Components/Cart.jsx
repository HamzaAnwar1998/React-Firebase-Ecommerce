import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { CartProducts } from './CartProducts';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import { auth, fs } from '../Config/Config';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

export const Cart = () => {
  
  // getting current user function
  function GetCurrentUser() {
    const [user, setUser] = useState(null);
    useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
        fs.collection('users')
            .doc(user.uid)
            .get()
            .then((snapshot) => {
            setUser(snapshot.data().FullName);
            });
        } else {
        console.log('user is not logged in to retrive user');
        setUser(null);
        }
    });
    return () => unsubscribe && unsubscribe();
    }, []);
    return user;
  }

  //getting current user
  const user = GetCurrentUser();
  // console.log(user); 

  // state of cart products
  const [cartProducts, setCartProducts] = useState([]);
  // console.log(cartProducts);

  // getting cart products and update the cartProducts state
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          setCartProducts(newCartProduct);
        });
      } else {
        console.log('user is not logged in retrive cart');
      }
    });
  }, []); 

  // getting the qty from cartProducts in a separate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value : Qty
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;
  const totalQty = qty.reduce(reducerOfQty, 0);
  // console.log('Qty:' + totalQty);

   // getting the prices from cartProducts in a separate array
   const totalPrice = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });

  // reducing the price in a single value : TotalPrice
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const TotalPrice = totalPrice.reduce(reducer, 0);
  // console.log('TotalPrice:' + TotalPrice); 
 
  // definng globl variable
  let Product;

  // product decrease
  const productDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;
    }   
    //updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid)
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => {
            console.log('decrement');
          });
      } else {
        console.log('user is not logged in to increment');
      }
    });
  };

  // product increase
  const productIncrease = (cartProduct) => {
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;   
    //updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection('Cart ' + user.uid)
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => {
            console.log('increment added');
          });
      } else {
        console.log('user is not logged in to increment');
      }
    });
  };
  
  const history = useHistory();

  const handleToken = async (token) => {
    // console.log(token);
    const cart = { name: 'All products', TotalPrice };
    const response = await axios.post('http://localhost:8080/checkout', {
      cart,
      token,
    });   

    let { status } = response.data;

    if (status === 'success') {
      history.push('/');
      toast.success('Your order has been placed successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      const uid = auth.currentUser.uid;
      const carts = await fs.collection('Cart ' + uid).get();

      for (var snap of carts.docs) {
        fs.collection('Cart ' + uid)
          .doc(snap.id)
          .delete();
      }
    } else {
      alert('something went wrong in checkout. Please try again');
    }
  };

  return (
    <>
      <Navbar user={user} totalQty={totalQty} />
      <br></br>
      {cartProducts.length > 0 && (
        <div className='container-fluid'>
          <h1 className='text-center'>Cart</h1>
          <div className='products-box'>
            <CartProducts
              cartProducts={cartProducts}
              productIncrease={productIncrease}
              productDecrease={productDecrease}
            />
          </div>
          <div className='summary-box'>
            <h5>Cart Summary</h5>
            <br></br>
            <div>
              Total No of Products: <span>{totalQty}</span>
            </div>
            <div>
              Total Price to Pay: <span>$ {TotalPrice}</span>
            </div>
            <br></br>
            <StripeCheckout
              stripeKey='pk_test_51Hhu6bK4kL4WRmvGEUkTmdFw1lUtTAnadBSDb0eXGuA2JJGrntIBdm10llYu5RbPbLbaS1My74Rgdi0n5ePYIGB600p3V4GKmK'
              token={handleToken}
              billingAddress
              shippingAddress
              amount={TotalPrice * 100}
              name='All Products'
            ></StripeCheckout>
          </div>
        </div>
      )}
      {cartProducts.length < 1 && (
        <div className='container-fluid'>No products to show</div>
      )}
    </>
  );
};