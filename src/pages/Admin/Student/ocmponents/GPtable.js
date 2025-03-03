import React from "react";
import { useNavigate } from "react-router-dom";

function GPtable({ session, cgpa, id, generatePDF, target }) {
  const navigate = useNavigate();
  return (
    <div class="gp_table">
      <div>
        <div>
          <p>Semester GPA:</p>
          <h3>{session.gpa}</h3>
        </div>
        <div>
          <p>Cummulative GPA:</p>
          <h3>{cgpa}</h3>
        </div>
      </div>
      <div class="transcript_button">
        <button
          onClick={() => generatePDF(target, { filename: "statement.pdf" })}
        >
          Print statement
        </button>
        <button
          onClick={() =>
            navigate(
              `/admin/student/transcript/${session.session}/${session.level}/${id}`
            )
          }
        >
          Generate transcript
        </button>
      </div>
    </div>
  );
}

export default GPtable;
