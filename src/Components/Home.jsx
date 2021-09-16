import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';
import { Navbar } from './Navbar';
import { Products } from './Products';

export const Home = (props) => {

  // getting current user uid
  function GetUID(){
    const [uid, setUid]=useState(null);
    useEffect(()=>{
      auth.onAuthStateChanged(user=>{
        if(user){
          setUid(user.uid);
        }
      })
    },[])
    return uid
  }

  // getting uid
  const uid = GetUID();

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
 
  // state of products
  const [products, setProducts] = useState([]);
  // console.log(products);
  
  // getting products
  const getProducts = async () => {
  const products = await fs.collection('Products').get();
  const productArray = [];  
  for (var snap of products.docs) {
    var data = snap.data();
    data.ID = snap.id;
    productArray.push({
      ...data,
    });
    if(productArray.length === products.docs.length){     
        setProducts(productArray);
      }
    }
  };
  useEffect(() => {    
    getProducts();   
  }, []);

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
    
  // defining variable
  let Product;
  // add to cart
  const addToCart = (product) => {   
    const check = cartProducts.find((myProduct) => myProduct.ID === product.ID);
    if (check) {
      console.log('match found');
    } else {     
      Product = product;
      Product['qty'] = 1;
      Product['TotalProductPrice'] = Product.qty * Product.price;
      if(uid!==null){
        // console.log(uid);
        fs.collection('Cart ' + uid).doc(product.ID).set(Product).then(()=>{
          console.log('successfully added to cart');
        })
      }
      else{
        props.history.push('/login');
      }
    }
  };
  
  // getting the qty from cartProducts in a separate array
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });

  // reducing the qty in a single value : Qty
  const reducerOfQty = (accumulator, currentValue) =>
    accumulator + currentValue;
  const totalQty = qty.reduce(reducerOfQty, 0);
  // console.log('Qty:' + totalQty);
 
  return (
    <>
      <Navbar user={user} totalQty={totalQty} />
      <br></br>
      {products.length > 0 && (
        <div className='container-fluid'>
          <h1 className='text-center'>Products</h1>
          <div className='products-box'>
            <Products products={products} addToCart={addToCart} />
          </div>
        </div>
      )}
      {products.length < 1 && (
        <div className='container-fluid'>
          Getting products from database. Please wait...
        </div>
      )}
    </>
  );
};

export default Home;