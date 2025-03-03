import React from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Table({ students = [] }) {
  // Sort students alphabetically by fullname
  students.sort((a, b) => a.fullname.localeCompare(b.fullname));

  const { level, semester } = useParams();
  const navigate = useNavigate();
  const current_semester = levels[level]?.[semester] || {};
  const course_codes = Object.keys(current_semester);

  return (
    <div className="table trans">
      {/* Main Table */}
      <table>
        <thead>
          <tr>
            <th className="center">S/N</th>
            <th>Reg. No.</th>
            <th>Names</th>
            {course_codes.map((course_code) => (
              <th key={course_code} className="center">
                {course_code}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map((student, i) => (
              <tr key={student?.student_id || i}>
                <td className="center">{i + 1}</td>
                <td
                  onClick={() =>
                    navigate(`/admin/student/${student?.student_id}`)
                  }
                >
                  {student?.reg_no || "N/A"}
                </td>
                <td
                  onClick={() =>
                    navigate(`/admin/student/${student?.student_id}`)
                  }
                >
                  {student?.fullname || "Unknown"}
                </td>
                {course_codes.map((course_code) => {
                  const course =
                    student?.courses.find(
                      (c) => c.course_code === course_code
                    ) || null;
                  return (
                    <td key={course_code} className="center">
                      {course ? (
                        <CheckIcon color="success" />
                      ) : (
                        <CloseIcon color="error" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>

      {/* External Courses Section */}
      <div>
        <p>Extra Curricular Courses</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Names</th>
            <th>Reg. No.</th>
            <th>Course</th>
            <th className="center">Unit</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map((student) =>
              (student?.courses || [])
                .filter((course) => course.external)
                .map((course, index) => (
                  <tr
                    key={`${student?.student_id || index}-${
                      course.course_code
                    }`}
                  >
                    <td>{student?.fullname || "Unknown"}</td>
                    <td>{student?.reg_no || "N/A"}</td>
                    <td>{`${course.course_code} - ${course.course_title}`}</td>
                    <td className="center">{course.unit_load}</td>
                  </tr>
                ))
            )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
