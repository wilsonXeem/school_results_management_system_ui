import React, { useState, useEffect } from "react";
import Levels from "./components/Courses";
import PreviousSession from "./components/PreviousSession";
import "./departments.css";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function Departments() {
  const [load, setLoad] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch(`${API_BASE_URL}/api/sessions/`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setCurrent_session(
            json.sessions.filter((session) => session.current === true)
          );
          setOther_sessions(
            json.sessions.filter((session) => session.current === false)
          );
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="header">
        <h2>Faculty courses</h2>
      </div>
      {load && <Loader />}
      <div className="faculty_courses">
        <div className="current_session">
          <p>Current session:</p>
          {current_session.length > 0 && <h2>{current_session[0].session}</h2>}
        </div>
        {current_session.length > 0 && (
          <Levels session={current_session[0].session} />
        )}
        <div className="previous_sessions_container">
          <p>Other sessions:</p>
          {other_sessions.length > 0 && (
            <div className="previous_sessions">
              {other_sessions.map((session) => (
                <PreviousSession session={session.session} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Departments;
