import React from "react";
import courses from "../../../data/courses";
import levels from "../../../data/levels";
import external from "../../../data/external";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNavigate, useParams } from "react-router-dom";

function Department() {
  const navigate = useNavigate();
  const { code, session } = useParams();
  const level = [200, 300, 400, 500, 600];
  const first_semester = level.map((course) =>
    Object.keys(levels[course][1]).filter(
      (course_code) =>
        course_code.charAt(4) === `${code}` && !(course_code in external)
    )
  );
  const second_semester = level.map((course) =>
    Object.keys(levels[course][2]).filter(
      (course_code) =>
        course_code.charAt(4) === `${code}` && !(course_code in external)
    )
  );

  return (
    <div class="department">
      <div class="header">
        <h2>{courses[code]}</h2>
      </div>
      <div className="current_session">
        <p>Current session: </p>
        <h2>{session}</h2>
      </div>
      <div class="departmental_courses">
        <div>
          <p>First semester:</p>
          {level.map((lev, i) => (
            <div key={i}>
              <h3>{lev} level</h3>
              {first_semester[i].map((course_code) => (
                <button
                  className="first"
                  onClick={() =>
                    navigate(
                      `/admin/faculty/${session}/${lev}/1/${course_code}`
                    )
                  }
                >
                  {course_code} <OpenInNewIcon />
                </button>
              ))}
            </div>
          ))}
        </div>
        <div>
          <p>Second semester:</p>
          {level.map((lev, i) => (
            <div key={i}>
              <h3>{lev} level</h3>
              {second_semester[i].map((course_code) => (
                <button
                  className="second"
                  onClick={() =>
                    navigate(
                      `/admin/faculty/${session}/${lev}/2/${course_code}`
                    )
                  }
                >
                  {course_code} <OpenInNewIcon />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Department;
