
import {PRODUCT_LOADING,GET_PRODUCTS,ADD_TO_CART,REMOVE_ITEM,SUB_QUANTITY,ADD_QUANTITY} from './types'
import axios from 'axios';

// Get Products
export const getProducts = () => dispatch => {
    dispatch(setProductsLoading());
    axios
      .get('/api/product')
      .then(res =>{
        dispatch({
          type: GET_PRODUCTS,
          payload: res.data
        })}
      )
      .catch(err =>
        dispatch({
          type: GET_PRODUCTS,
          payload: null
        })
      );
  };
//add cart action
export const addToCart= (id)=>{
    return{
        type: ADD_TO_CART,
        id
    }
}
//remove item action
export const removeItem=(id)=>{
    return{
        type: REMOVE_ITEM,
        id
    }
}
//subtract qt action
export const subtractQuantity=(id)=>{
    return{
        type: SUB_QUANTITY,
        id
    }
}
//add qt action
export const addQuantity=(id)=>{
    return{
        type: ADD_QUANTITY,
        id
    }
}
export const setProductsLoading = () => {
    return {
      type: PRODUCT_LOADING
    };
  };
