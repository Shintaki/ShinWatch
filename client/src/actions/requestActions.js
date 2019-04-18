import axios from "axios";
import isEmpty from "../utils/is-empty";

import {
  //GET_REQUEST,
  GET_REQUESTS,
  REQUEST_LOADING,
  CLEAR_CURRENT_REQUEST,
  GET_ERRORS
} from "./types";

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
    .then(res => history.push("/request"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
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
