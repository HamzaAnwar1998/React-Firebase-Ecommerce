import React from 'react'
import {useHistory} from 'react-router-dom'
import {auth} from '../Config/Config'

export const IndividualProduct = ({individualProduct,addToCart}) => {

    const history = useHistory();   
   
    const handleAddToCart = () => {
        if (auth.currentUser !== null) {
          addToCart(individualProduct);
        } else {
          history.push('/login');
        }
    };

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>$ {individualProduct.price}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleAddToCart}>ADD TO CART</div>
        </div>
    )
}

export default IndividualProduct
