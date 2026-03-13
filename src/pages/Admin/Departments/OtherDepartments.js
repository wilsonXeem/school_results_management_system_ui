import React, { useState, useEffect } from "react";
import Levels from "./components/Courses";
import PreviousSession from "./components/PreviousSession";
import "./departments.css";
import { useParams } from "react-router-dom";
import Loader from "../../../components/Loader";
import { API_BASE_URL } from "../../../config/api";

function OtherDepartments() {
  const { sesion } = useParams();
  const [load, setLoad] = useState(false);
  const [other_sessions, setOther_sessions] = useState([]);

  useEffect(() => {
    setLoad(true);
    fetch(`${API_BASE_URL}/api/sessions/`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
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
        <h2>Faculty courses</h2>
      </div>
      {load && <Loader />}
      <div className="faculty_courses">
        <div className="current_session">
          <p>Current session:</p>
          <h2>{sesion}</h2>
        </div>
        <Levels session={sesion} />
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

export default OtherDepartments;
