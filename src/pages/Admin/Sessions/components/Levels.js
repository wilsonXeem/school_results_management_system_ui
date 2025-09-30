import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

function Levels({ classes, session }) {
  const navigate = useNavigate();
  
  const handleNavigation = useCallback((session, level, levelId, semester) => {
    navigate(`/admin/course-reg/${session}/${level}/${levelId}/${semester}`);
  }, [navigate]);
  
  if (!classes?.length) {
    return (
      <div className="levels">
        <p>No classes available for this session.</p>
      </div>
    );
  }
  
  return (
    <div className="levels">
      <p>Classes:</p>
      {classes.map((level) => (
        <div className="level" key={level._id || level.level}>
          <h3>{level.level} Level</h3>
          <div>
            <button
              className="blue"
              onClick={() => handleNavigation(session, level.level, level._id, 1)}
            >
              First semester
            </button>
            <button
              className="gray"
              onClick={() => handleNavigation(session, level.level, level._id, 2)}
            >
              Second semester
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(Levels);
