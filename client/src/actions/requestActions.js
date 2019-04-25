import axios from "axios";
import isEmpty from "../utils/is-empty";

import {
  GET_REQUEST,
  GET_REQUESTS,
  REQUEST_LOADING,
  CLEAR_CURRENT_REQUEST,
  GET_ERRORS,
  CLEAR_ERRORS
} from "./types";

export const getRequests = () => dispatch => {
  dispatch(setRequestLoading());
  axios
    .get("/api/request")
    .then(res => {
      dispatch({
        type: GET_REQUESTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );
};

// get Requests
export const getRequestsByType = type => dispatch => {
  dispatch(setRequestLoading());
  axios
    .get(`/api/request/${type}`)
    .then(res => {
      dispatch({
        type: GET_REQUESTS,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: GET_REQUESTS,
        payload: null
      })
    );
};

export const getRequest = id => dispatch => {
  dispatch(setRequestLoading());
  axios
    .get(`/api/request/${id}`)
    .then(res =>
      dispatch({
        type: GET_REQUEST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_REQUEST,
        payload: null
      })
    );
};

// Get all requests
export const getRequestBySearch = searchText => dispatch => {
  dispatch(setRequestLoading());
  if (!isEmpty(searchText)) {
    axios
      .get(`/api/request/all/${searchText}`)
      .then(res =>
        dispatch({
          type: GET_REQUESTS,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_REQUESTS,
          payload: null
        })
      );
  } else {
    //dispatch(getRequests());
  }
};

// Create Request
export const createRequest = (requestData, history) => dispatch => {
  axios
    .post("/api/request", requestData)
    .then(res => history.push("/requests"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Like / Remove Like
export const addLike = (id,type) => dispatch => {
  console.log(type);
  axios
    .post(`/api/request/like/${id}`)
    .then(res => dispatch(getRequestsByType(type)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Add Reaction / Remove Reaction
export const addReaction = (id, type) => dispatch => {
  dispatch(clearErrors());
  const typereaction = {};
  typereaction.type = type;
  axios
    .post(`/api/request/react/${id}`, typereaction)
    .then(res => dispatch(getRequest(id)))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Comment
export const addComment = (requestId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/request/comments/${requestId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_REQUEST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (requestId, commentId) => dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete(`/api/request/comments/${requestId}/${commentId}`)
      .then(res =>
        dispatch({
          type: GET_REQUEST,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Request loading
export const setRequestLoading = () => {
  return {
    type: REQUEST_LOADING
  };
};

// Clear Request
export const clearCurrentRequest = () => {
  return {
    type: CLEAR_CURRENT_REQUEST
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
