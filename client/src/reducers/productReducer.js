
import {PRODUCT_LOADING,GET_PRODUCTS,ADD_TO_CART,REMOVE_ITEM,SUB_QUANTITY,ADD_QUANTITY,ADD_SHIPPING,SUB_SHIPPING} from '../actions/types'


const initState = {
    items: [],
    addedItems:[],
    total: 0,
    loading: false,
}
const productReducer= (state = initState,action)=>{
    if(action.type ===  PRODUCT_LOADING)
    {
        return {
            ...state,
            loading: true
          };
    }
    if(action.type ===GET_PRODUCTS)
    {
        return {
            ...state,
            items: action.payload,
            loading: false
            };
    }
    //INSIDE HOME COMPONENT
    if(action.type === ADD_TO_CART){
        // get the actual quantity available to test on
          let addedItem = state.items.find(item=> item._id === action.id)
          let quantity = addedItem.quantity;
        // clone the item to not change state.items when doing operations on it  
          var clonedItem = {...addedItem};
          //check if the action id exists in the addedItems
         let existed_item= state.addedItems.find(item=> action.id === item._id)
         if(existed_item)
         {
            if (existed_item.quantity+1>quantity)
                {alert('Operation impossible , the quantity demanded is unavailable')}
            else{
                existed_item.quantity += 1 
                return{
                    ...state,
                    total: state.total + clonedItem.price 
                  }
                }
        }
         else{
            clonedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + clonedItem.price 
            
            return{
                ...state,
                addedItems: [...state.addedItems, clonedItem],
                total : newTotal
            }
            
        }
    }
    if(action.type === REMOVE_ITEM){
        let itemToRemove= state.addedItems.find(item=> action.id === item._id)
        const removeIndex = state.addedItems
            .map(product=>product._id)
            .indexOf(action.id); 
            state.addedItems.splice(removeIndex,1);
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )
        return{
            ...state,
            addedItems: state.addedItems,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if(action.type=== ADD_QUANTITY){
        let addedItem = state.addedItems.find(item=> item._id === action.id)
        // get the actual quantity available to test on
        let Item = state.items.find(item=> item._id === action.id)
        let quantity = Item.quantity;
        if (addedItem.quantity+1>quantity)
            {alert('Operation impossible , the quantity demanded is unavailable')}
        else{
          addedItem.quantity += 1 
          let newTotal = state.total + addedItem.price
          return{
              ...state,
              total: newTotal
          }
        }
    }
    if(action.type=== SUB_QUANTITY){  
        let addedItem = state.addedItems.find(item=> item._id === action.id) 
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1){
            let itemToRemove= state.addedItems.find(item=> action.id === item._id)
            const removeIndex = state.addedItems
            .map(product=>product._id)
            .indexOf(action.id); 
            state.addedItems.splice(removeIndex,1);
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )
        return{
            ...state,
            addedItems: state.addedItems,
            total: newTotal
        }
        }
        else {
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return{
                ...state,
                total: newTotal
            }
        }
        
    }

    if(action.type=== ADD_SHIPPING){
          return{
              ...state,
              total: state.total + 50
          }
    }

    if(action.type=== SUB_SHIPPING){
        return{
            ...state,
            total: state.total - 50
        }
  }

    return state
}

export default productReducer