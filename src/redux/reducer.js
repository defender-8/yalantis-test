import axios from "axios";

const initialState = {
  employees: null,
  loading: true,
  errorMessage: false,
};

const actionTypes = {
  GET_EMPLOYEES: "GET_EMPLOYEES",
  UPDATE_EMPLOYEE: "UPDATE_EMPLOYEE",
  GET_ERROR: "GET_ERROR",
};

export const getEmployees = (activeEmployees) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        "https://yalantis-react-school-api.yalantis.com/api/task0/users"
      );
      const employees = response.data.map((emp) => {
        if (!activeEmployees.length) {
          return { ...emp, isActive: false };
        } else {
          return {
            ...emp,
            isActive: activeEmployees.includes(emp.id),
          };
        }
      });

      dispatch({
        type: actionTypes.GET_EMPLOYEES,
        payload: employees,
      });
    } catch (err) {
      console.log("err:\n", err);

      let payload;

      if (err.response.data) {
        const { status, data } = err.response;
        payload = `${status}: ${data}`;
      } else {
        payload = err.message;
      }

      dispatch({
        type: actionTypes.GET_ERROR,
        payload,
      });
    }
  };
};

export const updateEmployee = (employee) => {
  return async (dispatch) => {
    dispatch({
      type: actionTypes.UPDATE_EMPLOYEE,
      payload: employee,
    });
  };
};

function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.GET_EMPLOYEES:
      return {
        ...state,
        loading: false,
        employees: payload,
      };
    case actionTypes.UPDATE_EMPLOYEE:
      const index = state.employees.findIndex((e) => e.id === payload.id);
      state.employees[index].isActive = !payload.isActive;

      return {
        ...state,
      };
    case actionTypes.GET_ERROR:
      return {
        ...state,
        loading: false,
        errorMessage: payload,
      };
    default:
      return state;
  }
}

export default reducer;
