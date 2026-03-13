import React from "react";
import { useNavigate } from "react-router-dom";
import courses from "../../../../data/courses";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function Courses({session}) {
  const navigate = useNavigate();
  const faculty_courses = Object.values(courses);
  const course_codes = Object.keys(courses);
  return (
    <div className="levels">
      <p>Courses:</p>
      {faculty_courses.map((course, i) => (
        <div className="courses" key={i}>
          <div
            className="course"
            onClick={() =>
              navigate(
                `/admin/faculty/${session}/courses/${course_codes[i]}`
              )
            }
          >
            <h3>
              {course} <OpenInNewIcon />
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Courses;
