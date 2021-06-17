import React,{useState,useEffect} from 'react'
import {fs} from '../Config/Config'

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

export const Home = () => {
    const data = GetDataFromFirestore();
    console.log(data); 
    return (
        <div>
            Home
        </div>
    )
}
