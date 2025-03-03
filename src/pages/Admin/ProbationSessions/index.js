import React, { useState, useEffect } from "react";
import "./sessions.css";
import Levels from "./components/Levels";
import PreviousSession from "./components/PreviousSession";
import Loader from "../../../components/Loader";

function ResultSessions() {
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [session, setSession] = useState("");
  const [current, setCurrent] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.success) {
          if (json.sessions.length < 1) {
            setShow(true);
          }
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
        <h2>Probation List: sessions</h2>
      </div>
      {load && <Loader />}
      <div class="current_session">
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
          <div class="previous_sessions">
            {other_sessions.map((session) => (
              <PreviousSession session={session.session} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ResultSessions;
