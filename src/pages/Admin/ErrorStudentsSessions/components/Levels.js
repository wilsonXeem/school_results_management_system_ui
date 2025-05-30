import React from "react";
import { useNavigate, useParams } from "react-router-dom";

function Levels({ session, classes }) {
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
                  `/admin/faculty/error/students/list/${session}/${level._id}/${level.level}/1`
                )
              }
            >
              First semester
            </button>
            <button
              className="gray"
              onClick={() =>
                navigate(
                  `/admin/faculty/error/students/list/${session}/${level._id}/${level.level}/2`
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
