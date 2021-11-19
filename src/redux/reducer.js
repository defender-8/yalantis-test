import axios from "axios";

const initialState = {
  employees: null,
  loading: true,
  error: false,
};

const actionTypes = {
  RESET: "RESET",
  GET: "GET",
  GET_ERROR: "GET_ERROR",
};

export const get = () => {
  return async dispatch => {
    try {
      const response = await axios.get('https://yalantis-react-school-api.yalantis.com/api/task0/users');
      const employees = response.data;

      dispatch({
        type: actionTypes.GET,
        payload: employees,
      })
    } catch (err) {

    }
  }
}

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.GET:
      return {
        ...state,
        loading: false,
        employees: payload,
      };
    case actionTypes.GET_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      };
    default:
      return state;
  }
}

export default reducer;
