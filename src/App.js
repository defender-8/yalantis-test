import React, { useState, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import { getEmployees, updateEmployee } from "./redux/reducer";

import "./App.css";

const EmployeesContext = createContext();

function App() {
  const { employees, loading, errorMessage } = useSelector((state) => state);
  const [activeEmployees, setActiveEmployees] = useState(
    JSON.parse(window.localStorage.getItem("activeEmployees")) || {}
  );

  const activeEmployeesArrLength = Object.keys(activeEmployees).length;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEmployees(Object.keys(activeEmployees)));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "activeEmployees",
      JSON.stringify(activeEmployees)
    );
  }, [activeEmployeesArrLength]);

  return (
    <div className="layout clearfix">
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : loading ? (
        "Loading..."
      ) : (
        <EmployeesContext.Provider value={setActiveEmployees}>
          <div className="layout-left">
            <Employees employees={employees} />
          </div>
          <div className="layout-right">
            <Birthdays activeEmployees={activeEmployees} />
          </div>
        </EmployeesContext.Provider>
      )}
    </div>
  );
}

export default App;

// Components

Employees.propTypes = {
  employees: PropTypes.array,
};

function Employees({ employees }) {
  const employeesAlphabetical = getUsersAlphabetical(employees);

  return (
    <>
      <h2>Employees</h2>
      <div className="employees">
        {employeesAlphabetical.map((item) => {
          return <EmployeesLetterBlock key={item.letter} item={item} />;
        })}
      </div>
    </>
  );
}

EmployeesLetterBlock.propTypes = {
  item: PropTypes.object,
};

function EmployeesLetterBlock({ item: { letter, users } }) {
  return (
    <div className="employees-letter-block">
      <div className="employees-letter-block-title">{letter}</div>
      <EmployeesList employees={users} />
    </div>
  );
}

EmployeesList.propTypes = {
  employees: PropTypes.array,
};

function EmployeesList({ employees }) {
  return employees.length ? (
    <ul className="employees-list">
      {employees.map((emp) => {
        return <EmployeesListItem key={emp.id} employee={emp} />;
      })}
    </ul>
  ) : (
    <div className="employees-list-empty">No Employees</div>
  );
}

EmployeesListItem.propTypes = {
  employee: PropTypes.object,
};

function EmployeesListItem({ employee }) {
  const { id, firstName, lastName, dob, isActive } = employee;
  const setActiveEmployees = useContext(EmployeesContext);

  const dispatch = useDispatch();

  const onChange = (e) => {
    dispatch(updateEmployee(employee));

    if (!isActive) {
      setActiveEmployees((state) => ({
        ...state,
        [id]: {
          firstName,
          lastName,
          dob,
        },
      }));
    } else {
      setActiveEmployees((state) => {
        delete state[id];
        return state;
      });
    }
  };

  return (
    <li className={`employees-list-item${isActive ? " active" : ""}`}>
      <div className="employees-list-item-name">{`${firstName} ${lastName}`}</div>
      <form>
        <div className="radio-item">
          <input
            type="radio"
            id={`${id}notActive`}
            name="status"
            value={false}
            checked={!isActive}
            onChange={onChange}
          />
          <label htmlFor={`${id}notActive`}>not active</label>
        </div>
        <div className="radio-item">
          <input
            type="radio"
            id={`${id}active`}
            name="status"
            value={true}
            checked={isActive}
            onChange={onChange}
          />
          <label htmlFor={`${id}active`}>active</label>
        </div>
      </form>
    </li>
  );
}

Birthdays.propTypes = {
  activeEmployees: PropTypes.object,
};

function Birthdays({ activeEmployees }) {
  const employeesByMonth = getUsersByMonth(activeEmployees);

  return (
    <>
      <h2>Employees birthday</h2>
      <div className="birthdays">
        {Object.keys(activeEmployees).length ? (
          employeesByMonth.map((emp) => {
            return (
              <MonthBirthdays
                key={emp.month}
                month={emp.month}
                employees={emp.users}
              />
            );
          })
        ) : (
          <div className="birthdays-empty">Employees List is empty</div>
        )}
      </div>
    </>
  );
}

MonthBirthdays.propTypes = {
  month: PropTypes.string,
  employees: PropTypes.array,
};

function MonthBirthdays({ month, employees }) {
  return (
    <div className="month-birthdays">
      <div className="month-birthdays-title">{month}</div>
      {employees.length ? (
        <ul className="month-birthdays-list">
          {employees.map((emp) => {
            return (
              <li key={emp.id}>
                {`${emp.lastName} ${emp.firstName} - ${emp.dob}`}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="month-birthdays-empty">No Employees</div>
      )}
    </div>
  );
}

// Functions
function sortObjectsBy(key) {
  return (a, b) => (a[key] > b[key] ? 1 : -1);
}

function getUsersAlphabetical(users) {
  const alphabetCodes = Array.from(Array(26)).map((elem, i) => i + 65);
  const alphabetArr = alphabetCodes.map((x) => String.fromCodePoint(x));

  const usersAlphabeticalObj = {};

  alphabetArr.forEach((letter) => (usersAlphabeticalObj[letter] = []));

  users
    .sort(sortObjectsBy("firstName"))
    .forEach((user) => usersAlphabeticalObj[user.firstName[0]].push(user));

  return Object.entries(usersAlphabeticalObj).map(([letter, users]) => ({
    letter,
    users,
  }));
}

function getMonths() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const monthsFromCurrent = [];

  for (let i = currentMonthIndex; i < months.length; i++) {
    monthsFromCurrent.push(months[i]);
  }

  for (let i = 0; i < currentMonthIndex; i++) {
    monthsFromCurrent.push(months[i]);
  }

  return { months, monthsFromCurrent };
}

function getUsersByMonth(usersObj) {
  const { months, monthsFromCurrent } = getMonths();
  const usersByMonth = {};

  monthsFromCurrent.map((month) => (usersByMonth[month] = []));

  const usersArr = Object.entries(usersObj).map(([id, user]) => ({
    id,
    ...user,
  }));

  usersArr.sort(sortObjectsBy("lastName")).forEach((user) => {
    const dobObject = new Date(Date.parse(user.dob));
    const yearOfBirth = dobObject.getFullYear();
    const monthOfBirth = months[dobObject.getMonth()];
    const dayOfBirth = dobObject.getDate();

    const dobFormatted = `${dayOfBirth} ${monthOfBirth}, ${yearOfBirth} year`;

    usersByMonth[monthOfBirth].push({ ...user, dob: dobFormatted });
  });

  return Object.entries(usersByMonth).map(([month, users]) => ({
    month,
    users,
  }));
}
