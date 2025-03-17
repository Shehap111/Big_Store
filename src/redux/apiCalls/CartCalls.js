import {cartActions} from "../slices/CartSlice"

// add to cart
export function addToCart(newItem) {
    return (dispatch) => {
        dispatch(cartActions.addToCart(newItem))
    }
    
}

// remove from cart
export function removeItemFromCart(id) {
    return (dispatch) => {
        dispatch(cartActions.removeFromCart(id))
    }
    
}