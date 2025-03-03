import React, { useState, useEffect } from "react";
import Levels from "./components/Courses";
import PreviousSession from "./components/PreviousSession";
import "./departments.css";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";

function OtherDepartments() {
  const { sesion } = useParams();
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [session, setSession] = useState("");
  const [current, setCurrent] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);

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

  return (
    <>
      <div class="header">
        <h2>Faculty courses</h2>
      </div>
      {load && <Loader />}
      <div class="faculty_courses">
        <div class="current_session">
          <p>Current session:</p>
          <h2>{sesion}</h2>
        </div>
        <Levels session={sesion} />
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
      </div>
    </>
  );
}

export default OtherDepartments;
