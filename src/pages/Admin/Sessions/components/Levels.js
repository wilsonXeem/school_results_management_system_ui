import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function Levels({ classes, session }) {
  const navigate = useNavigate();
  return (
    <div className="levels">
      <p>Classes:</p>
      {classes.map((level, i) => (
        <div class="level" key={i}>
          <h3>{level.level} Level</h3>
          <div>
            <button
              className="blue"
              onClick={() =>
                navigate(
                  `/admin/course-reg/${session}/${level.level}/${level._id}/1`
                )
              }
            >
              First semester
            </button>
            <button
              className="gray"
              onClick={() =>
                navigate(
                  `/admin/course-reg/${session}/${level.level}/${level._id}/2`
                )
              }
            >
              Second semester
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Levels;
