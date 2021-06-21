import React,{useContext} from 'react'
import {CartContext} from '../Global/CartContext'

export const IndividualProduct = ({individualProduct}) => {

    const {dispatch}=useContext(CartContext);

    const handleAddToCart=()=>{        
        dispatch({type:'ADD_TO_CART',ID:individualProduct.ID,individualProduct})
    }

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>Rs {individualProduct.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
        </div>
    )
}
