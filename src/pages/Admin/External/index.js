import React, { useState, useEffect } from "react";
import courses from "../../../data/courses";
import levels from "../../../data/levels";
import external from "../../../data/external";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate, useParams } from "react-router-dom";
import "./external.css";
import PreviousSession from "./components/PreviousSession";
import Loader from "../../../components/Loader";

function External() {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [current_session, setCurrent_session] = useState([]);
  const [other_sessions, setOther_sessions] = useState([]);
  const [externals, setExternals] = useState([]);
  const level = [100, 200, 300];
  const first_semester = level.map((course) =>
    Object.keys(levels[course][1]).filter(
      (course_code) => course_code in external
    )
  );
  const second_semester = level.map((course) =>
    Object.keys(levels[course][2]).filter(
      (course_code) => course_code in external
    )
  );

  useEffect(() => {
    setLoad(true);
    fetch("http://127.0.0.1:1234/api/sessions/")
      .then((res) => res.json())
      .then((json) => {
        console.log(
          json.sessions.find((session) => session.current === true).externals
        );
        setCurrent_session(
          json.sessions.find((session) => session.current === true)
        );
        setExternals(
          json.sessions.find((session) => session.current === true).externals
        );
        setOther_sessions(
          json.sessions.filter((session) => session.current === false)
        );
        setLoad(false);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div class="department">
      <div class="header">
        <h2>non-professional courses</h2>
      </div>
      {load && <Loader />}
      <div className="current_session">
        <p>Current session: </p>
        <h2>{current_session.session}</h2>
      </div>
      <div class="departmental_courses">
        <div>
          <p>First semester:</p>
          {level.map((lev, i) => (
            <div key={i} className="corses">
              <h3>{lev} level</h3>
              <div>
                {first_semester[i].map((course_code) => (
                  <button
                    className="first"
                    onClick={() =>
                      navigate(
                        `/admin/faculty/${current_session.session}/${lev}/1/${course_code}`
                      )
                    }
                  >
                    {course_code} <OpenInNewIcon />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div>
          <p>Second semester:</p>
          {level.map((lev, i) => (
            <div key={i} className="corses">
              <h3>{lev} level</h3>
              <div>
                {second_semester[i].map((course_code) => (
                  <button
                    className="second"
                    onClick={() =>
                      navigate(
                        `/admin/faculty/${current_session.session}/${lev}/2/${course_code}`
                      )
                    }
                  >
                    {course_code} <OpenInNewIcon />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div class="other_externals">
        <h4>Other Non-Professional Courses</h4>
        {externals?.length > 0 && (
          <div className="exs">
            {externals.map((external, i) => (
              <button
                key={i}
                style={{ textTransform: "uppercase" }}
                onClick={() =>
                  navigate(
                    `/admin/faculty/${current_session.session}/${external.semester}/${external.course_code}/${external.course_title}/${external.unit_load}`
                  )
                }
              >
                {external.course_code} <OpenInNewIcon />
              </button>
            ))}
          </div>
        )}
      </div>
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
  );
}

export default External;
