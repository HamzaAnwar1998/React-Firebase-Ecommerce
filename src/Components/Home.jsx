import React,{useState,useEffect} from 'react'
import {fs} from '../Config/Config'
import { Navbar } from './Navbar';
import {Products} from './Products'

// getting products
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
    return () => unsubscribe && unsubscribe()
  },[])
  return products
}

export const Home = ({user}) => {

    const products = GetDataFromFirestore();
    // console.log(products);   

    return (
        <>
            <Navbar user={user}/>
            <br></br>
            {products&&<div className='container-fluid'>             
              <h1 className='text-center'>Products</h1>
              <div className='products-box'>
                <Products products={products}/>
              </div>
            </div>}
            {!products&&<div>Getting products from database. Please wait</div>}            
        </>
    )
}
