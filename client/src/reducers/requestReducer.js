import { GET_REQUEST, GET_REQUESTS, REQUEST_LOADING } from "../actions/types";

const initialState = {
  requests: [],
  request: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REQUEST_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
        loading: false
      };

    case GET_REQUEST:
      return {
        ...state,
        request: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
