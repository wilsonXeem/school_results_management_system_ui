import React, { useMemo, useCallback } from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

function Table({ students = [] }) {
  const { level, semester } = useParams();
  const navigate = useNavigate();
  
  const { sortedStudents, course_codes, externalCourses } = useMemo(() => {
    const sortedStudents = [...students].sort((a, b) => a.fullname.localeCompare(b.fullname));
    const current_semester = levels[level]?.[semester] || {};
    const course_codes = Object.keys(current_semester);
    const courseCodesSet = new Set(course_codes);
    
    const externalCourses = [];
    sortedStudents.forEach((student) => {
      (student?.courses || []).forEach((course) => {
        if (course.external && !externalCourses.some(ec => 
          ec.student_id === student.student_id && ec.course_code === course.course_code
        )) {
          externalCourses.push({
            student_id: student.student_id,
            fullname: student.fullname,
            reg_no: student.reg_no,
            ...course
          });
        }
      });
    });
    
    return { sortedStudents, course_codes, externalCourses };
  }, [students, level, semester]);
  
  const handleStudentClick = useCallback((studentId) => {
    navigate(`/admin/student/${studentId}`);
  }, [navigate]);

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
          {sortedStudents.length > 0 &&
            sortedStudents.map((student, i) => (
              <tr key={student?.student_id || i}>
                <td className="center">{i + 1}</td>
                <td
                  onClick={() => handleStudentClick(student?.student_id)}
                  style={{ cursor: "pointer" }}
                >
                  {student?.reg_no || "N/A"}
                </td>
                <td
                  onClick={() => handleStudentClick(student?.student_id)}
                  style={{ cursor: "pointer" }}
                >
                  {student?.fullname || "Unknown"}
                </td>
                {course_codes.map((course_code) => {
                  const course = student?.courses.find(
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
      {externalCourses.length > 0 && (
        <>
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
              {externalCourses.map((course, index) => (
                <tr key={`${course.student_id}-${course.course_code}`}>
                  <td>{course.fullname || "Unknown"}</td>
                  <td>{course.reg_no || "N/A"}</td>
                  <td>{`${course.course_code} - ${course.course_title}`}</td>
                  <td className="center">{course.unit_load}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default React.memo(Table);
