import React, { useState, useEffect } from "react";
import "./sessions.css";
import Levels from "./components/Levels";
import PreviousSession from "./components/PreviousSession";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";

function OtherResultSessions() {
  const { sesion } = useParams();
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [session, setSession] = useState("");
  const [current, setCurrent] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          if (json.sessions.length < 1) {
            setShow(true);
          }
          setCurrent_session(
            json.sessions.find((session) => session.session === sesion)
          );
          setClasses(
            json.sessions.find((session) => session.session === sesion).classes
          );
          setOther_sessions(
            json.sessions.filter((session) => session.session !== sesion)
          );
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  }, [sesion]);

  return (
    <>
      <div className="header">
        <h2>Results: sessions</h2>
      </div>
      {load && <Loader />}
      <div class="current_session">
        <p>Current session:</p>
        <h2>{sesion}</h2>
      </div>
      {classes.length > 0 && <Levels session={sesion} classes={classes} />}
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

export default OtherResultSessions;
