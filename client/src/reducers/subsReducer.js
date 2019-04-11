import {SET_SUBS} from '../actions/types'
const initialState = {
    subscriptions: [],
}
export default  function(state = initialState , action)
{   
    switch(action.type){
        case SET_SUBS:
            return{
                subscriptions: action.payload.data
            }
        
        default:
            return state;
}
}