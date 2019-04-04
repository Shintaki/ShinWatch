import axios from 'axios';

import {
    //ADD_POST,
    GET_ERRORS
} from './types';

// Add Post
export const addPost = (postData , history) => dispatch => {
    axios
    .post('api/posts',postData)
    
    .then(res => history.push('/posts'))
        .catch(err=>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );  
}