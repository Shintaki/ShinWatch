import {SET_CURRENT_USER,RELOAD_CURRENT_USER} from '../actions/types'
import isEmpty from '../utils/is-empty'
const initialState = {
    isAuthentificated: false,
    user:{}
}
export default  function(state = initialState , action)
{   
    switch(action.type){
        case SET_CURRENT_USER:
            return{
                ...state,
                isAuthentificated: !isEmpty(action.payload),
                user: action.payload
            }
            case RELOAD_CURRENT_USER:
            return{
                ...state,
                user: action.payload
            }
            
        default:
            return state;
}
}