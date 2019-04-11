import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';
import subsReducer from './subsReducer'

export default combineReducers({
    auth : authReducer,
    errors : errorReducer,
    profile : profileReducer,
    post : postReducer,
    subscriptions: subsReducer
});