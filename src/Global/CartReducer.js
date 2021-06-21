import {auth,fs} from '../Config/Config'

export const CartReducer=(state,action)=>{

    const {shoppingCart,totalPrice, totalQty}=state;
    console.log(shoppingCart);   

    let individualProduct;
    let index;
    let updatedTotalPrice;
    let updatedTotalQty;

    switch(action.type){

        case 'ADD_TO_CART':

            console.log(shoppingCart);
            
            // const check = shoppingCart.find(individualProduct=>individualProduct.ID===action.ID);
            // if(check){
            //     return state;
            //     console.log(true);
            // }
            // else{
            //     return state;
            //     console.log(shoppingCart);
            //     console.log('false');
            // }
            
            // auth.onAuthStateChanged(user=>{
            //     if(user){                        
            //         fs.collection('Cart ' + user.uid).doc(action.ID).set({
            //             ID: action.ID,
            //             title: action.individualProduct.title,
            //             description: action.individualProduct.description,
            //             price: action.individualProduct.price,
            //             url: action.individualProduct.url,
            //         }).then(()=>{
            //             console.log('added to cart');
            //         })
            //     }
            //     else{
            //         console.log('user is not logged in to add to cart')
            //     }
            // })
            // return state;           
    }
}