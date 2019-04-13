import axios from 'axios';
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode';

import { GET_ERRORS , SET_CURRENT_USER , SET_SUBS} from './types';

//Register User
export const registerUser = (UserData,history) => dispatch => {
    axios
      .post('/api/users/register', UserData)
      .then(res => history.push('/login'))
      .catch(err => 
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data })
        
            );
}
// Login - Get User Token
export const loginUser = userData => dispatch => {
    axios
      .post('/api/users/login', userData)
      .then(res => {
          const {token} = res.data;
          // Save Token to local storage
          localStorage.setItem('jwtToken',token);
          // Set Token to authorization header
          setAuthToken(token);
          // get user data from token
          const decoded = jwt_decode(token);
          // add user handle to data
          axios
      .get('/api/users/handle')
      .then(res => {
          decoded.handle=res.data.handle;    
      })
      //Set current user
          dispatch(setCurrentUser(decoded));
        })
      .catch(err => dispatch({
        type: GET_ERRORS,
        payload: err.response.data })
        );
  
}
//sets current user's subs
export const setSubs = () => dispatch =>{
  axios.get('/api/users/sub')
  .then(res =>{
    dispatch(setCurrentSubs(res))
  })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data })
    )
}
//set subs by handle search
export const setSubsByHandle = (handle) => dispatch =>{
  axios.get(`/api/users/sub/${handle}`)
  .then(res =>{
    dispatch(setCurrentSubs(res))
  })
  .catch(err => dispatch({
    type: GET_ERRORS,
    payload: err.response.data })
    )
}
// Set logged in user
export const setCurrentUser = (decoded) => {
    return { 
        type: SET_CURRENT_USER,
        payload: decoded
    }
}
export const setCurrentSubs = (subs) => {
  return { 
      type: SET_SUBS,
      payload: subs
  }
}

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localstorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty and isAuthentificated to false
  dispatch(setCurrentUser({})); 
  dispatch(setCurrentSubs([])); 
}