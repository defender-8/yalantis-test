import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "./redux/reducer";

import "./App.css";

function App() {
  return (
    <div className="layout clearfix">
      <div className="layout-left">
        <Employees />
      </div>
      <div className="layout-right">
        <Birthdays />
      </div>
    </div>
  );
}

export default App;

// Components
function Employees() {
  const { employees, loading, error } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get());
  }, []);

  const employeesAlphabeticalArr = getUsersAlphabetical(employees);

  return error ? (
    "Error!"
  ) : loading ? (
    "Loading..."
  ) : (
    <div className="employees">
      {employeesAlphabeticalArr.map((item) => {
        return <EmployeesLetterBlock letterItem={item} />;
      })}
    </div>
  );
}

function EmployeesLetterBlock({ letterItem: { letter, users } }) {
  return (
    <div key={letter} className="employees-letter-block">
      <div>{letter}</div>
      <EmployeesList employees={users} />
    </div>
  );
}

function EmployeesList({ employees }) {
  return employees.length ? (
    <ul className="employees-list">
      {employees.map((emp) => {
        return <EmployeesListItem employee={emp} />;
      })}
    </ul>
  ) : (
    <div>No Employees</div>
  );
}

function EmployeesListItem({ employee }) {
  const { id, firstName, lastName } = employee;

  const onChange = (e) => {
    console.log(">>>>>>>>>>> e.target:\n", e.target);
  };

  return (
    <li key={id} className="employees-list-item">
      <div>{`${firstName} ${lastName}`}</div>
      <form>
        <div>
          <input
            type="radio"
            id={`${id}notActive`}
            name="status"
            value={id}
            onChange={onChange}
          />
          <label htmlFor={`${id}notActive`}>not active</label>
        </div>
        <div>
          <input
            type="radio"
            id={`${id}active`}
            name="status"
            value={id}
          />
          <label htmlFor={`${id}active`}>not active</label>
        </div>
      </form>
    </li>
  );
}

function Birthdays() {
  return <div className="birthdays">Birthdays</div>;
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
    ?.sort(sortObjectsBy("firstName"))
    .forEach((u) => usersAlphabeticalObj[u.firstName[0]].push(u));

  return Object.entries(usersAlphabeticalObj).map(([letter, users]) => ({
    letter,
    users,
  }));
}
