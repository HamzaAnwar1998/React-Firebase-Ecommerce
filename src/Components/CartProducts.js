import React from 'react'
import { IndividualCartProduct } from './IndividualCartProduct'

export const CartProducts = ({cartProducts,productIncrease,productDecrease,
   }) => {
    return cartProducts.map(cartProduct=>(
        
            <IndividualCartProduct key={cartProduct.ID} cartProduct={cartProduct}
                productIncrease={productIncrease}
                productDecrease={productDecrease}                
            />           
       
    ))
}
