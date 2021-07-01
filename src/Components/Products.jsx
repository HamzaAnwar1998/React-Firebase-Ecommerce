import React from 'react'
import {IndividualProduct} from './IndividualProduct'

export const Products = ({products, addToCart}) => {
    // console.log(products);
    console.log('Products.js rendered again');
    return products.map((individualProduct)=>(
        <IndividualProduct key={individualProduct.ID} individualProduct={individualProduct} addToCart={addToCart}/>
    ))
}

export default Products;
