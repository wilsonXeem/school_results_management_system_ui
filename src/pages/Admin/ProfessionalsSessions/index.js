import React, { useState, useEffect } from "react";
import "./sessions.css";
import Levels from "./components/Levels";
import PreviousSession from "./components/PreviousSession";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function ProfessionalsSessions() {
  const [load, setLoad] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch(`${API_BASE_URL}/api/sessions/`)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
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
        <h2>Results: sessions</h2>
      </div>
      {load && <Loader />}
      <div className="current_session">
        <p>Current session:</p>
        {current_session.length > 0 && <h2>{current_session[0].session}</h2>}
      </div>
      {current_session.length > 0 && (
        <Levels
          session={current_session[0].session}
          classes={current_session[0].classes}
        />
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
    </>
  );
}

export default ProfessionalsSessions;
