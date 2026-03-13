import React, { useState, useEffect } from "react";
import "./sessions.css";
import Levels from "./components/Levels";
import PreviousSession from "./components/PreviousSession";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function OtherSessions() {
  const { sesion } = useParams();
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [session, setSession] = useState("");
  const [current, setCurrent] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch(`${API_BASE_URL}/api/sessions/`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          if (json.sessions.length < 1) {
            setShow(true);
          }
          setCurrent_session(
            json.sessions.filter((session) => session.session === sesion)
          );
          setOther_sessions(
            json.sessions.filter((session) => session.session !== sesion)
          );
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  }, [sesion]);

  const register_session = () => {
    fetch(`${API_BASE_URL}/api/auth/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session,
        current,
      }),
    })
      .then((res) => res.json())
      .then((json) => window.location.reload())
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="header">
        <h2>Course registration</h2>
      </div>
      {load && <Loader />}
      <div className="current_session">
        <p>Current session:</p>
        {current_session.length > 0 && <h2>{current_session[0].session}</h2>}
        <div>
          <button onClick={() => setShow(true)}>Register new session</button>
        </div>
      </div>
      {show && (
        <div className="register_session">
          <p>Register session:</p>
          <input
            type="text"
            placeholder="Session"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          />
          <label for="current">Current session:</label>
          <input
            type="checkbox"
            name="current"
            id="current"
            value={current}
            onChange={() => setCurrent(!current)}
          />
          <button onClick={register_session}>Submit</button>
          <button
            style={{ backgroundColor: "red" }}
            onClick={() => setShow(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {current_session.length > 0 && (
        <Levels
          classes={current_session[0].classes}
          session={current_session[0].session}
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

export default OtherSessions;
