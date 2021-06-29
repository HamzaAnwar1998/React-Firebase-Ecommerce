import React,{useState,useEffect, memo} from 'react'
import {fs} from '../Config/Config'
import { Navbar } from './Navbar';
import {Products} from './Products'

// getting products
// function GetDataFromFirestore(){  
//   const [products, setProducts]=useState([]);
//   useEffect(()=>{   
//     const unsubscribe = fs.collection('Products').onSnapshot(snapshot=>{
//       const newProduct = snapshot.docs.map(doc=>({
//         ID: doc.id,
//         ...doc.data()
//       }))
//       setProducts(newProduct);
//     })
//     return () => unsubscribe && unsubscribe()
//   },[])
//   return products
// }

export const Home = ({user,addToCart,totalQty}) => {

    const [products, setProducts]=useState([]);
    useEffect(()=>{   
      const unsubscribe = fs.collection('Products').onSnapshot(snapshot=>{
        const newProduct = snapshot.docs.map(doc=>({
          ID: doc.id,
          ...doc.data()
        }))
        setProducts(newProduct);
      })
      return () => unsubscribe && unsubscribe()
    },[])

    // const products = useMemo(GetDataFromFirestore());
    // console.log(products);
    
    console.log('Home rendered again');
    
    return (
        <>
            <Navbar user={user} totalQty={totalQty}/>
            <br></br>
            {products.length>0&&<div className='container-fluid'>             
              <h1 className='text-center'>Products</h1>
              <div className='products-box'>
                <Products products={products} addToCart={addToCart}/>
              </div>
            </div>}
            {products.length < 1&&<div className='container-fluid'>Getting products from database. Please wait...</div>}            
        </>
    )
}

export default memo(Home);
