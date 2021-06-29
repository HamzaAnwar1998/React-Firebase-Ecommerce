import React from 'react'
import {Icon} from 'react-icons-kit'
import {plus} from 'react-icons-kit/feather/plus'
import {minus} from 'react-icons-kit/feather/minus'
import {auth,fs} from '../Config/Config'

export const IndividualCartProduct = ({cartProduct,productIncrease,productDecrease,
}) => {     

    const handleProductIncrease=()=>{
        productIncrease(cartProduct);
    }

    const handleProductDecrease=()=>{
        productDecrease(cartProduct);
    }

    const handleDelete=()=>{       
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart ' + user.uid).doc(cartProduct.ID).delete().then(()=>{
                    console.log('deleted');
                })
            }
        })
    }

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={cartProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{cartProduct.title}</div>
            <div className='product-text description'>{cartProduct.description}</div>
            <div className='product-text price'>$ {cartProduct.price}</div>
            <span>Quantity</span>
            <div className='product-text quantity-box'>
                <div className='action-btns minus' onClick={handleProductDecrease}>
                    <Icon icon={minus} size={20}/>
                </div>                
                <div>{cartProduct.qty}</div>               
                <div className='action-btns plus' onClick={handleProductIncrease}>
                    <Icon icon={plus} size={20}/>
                </div>
            </div>
            <div className='product-text cart-price'>$ {cartProduct.TotalProductPrice}</div>
            <div className='btn btn-danger btn-md cart-btn' onClick={handleDelete}>DELETE</div>            
        </div>
    )
}
