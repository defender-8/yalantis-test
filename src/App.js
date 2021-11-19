import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "./redux/reducer";

import "./App.css";

function App() {
  const { employees, loading, error } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(get());
  }, []);

  const Employees = () => {
    const employeesAlphabeticalArr = getUsersAlphabetical(employees);

    return (
      <div className="employees">
        {employeesAlphabeticalArr.map((item) => {
          return (
            <div key={item.letter} className="employees-letter-block">
              <div>{item.letter}</div>
              {item.users.length ? (
                <ul>
                  {item.users.map((u) => {
                    const onChange = (e) => {
                      console.log(">>>>>>>>>>> e.target:\n", e.target);
                    };
                    return (
                      <li key={u.id}>
                        <div>{`${u.firstName} ${u.lastName}`}</div>
                        <form>
                          <div>
                            <input
                              type="radio"
                              id={`${u.id}notActive`}
                              name="status"
                              value={u.id}
                              onChange={onChange}
                            />
                            <label htmlFor={`${u.id}notActive`}>
                              not active
                            </label>
                          </div>
                          <div>
                            <input
                              type="radio"
                              id={`${u.id}active`}
                              name="status"
                              value={u.id}
                            />
                            <label htmlFor={`${u.id}active`}>not active</label>
                          </div>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div>No Employees</div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const Birthdays = () => {
    return <div className="birthdays">Birthdays</div>;
  };

  return (
    <div className="layout clearfix">
      {error ? (
        "Error!"
      ) : loading ? (
        "Loading..."
      ) : (
        <>
          <div className="layout-left">
            <Employees />
          </div>
          <div className="layout-right">
            <Birthdays />
          </div>
        </>
      )}
    </div>
  );
}

export default App;

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
    .forEach((u) => usersAlphabeticalObj[u.firstName[0]].push(u));

  return Object.entries(usersAlphabeticalObj).map(([letter, users]) => ({
    letter,
    users,
  }));
}
