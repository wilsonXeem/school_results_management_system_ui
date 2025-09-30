import React, { useMemo, useCallback } from "react";
import levels from "../../../../data/levels";
import professionals from "../../../../data/professionals";
import { useParams, useNavigate } from "react-router-dom";

function Table({ students }) {
  const { level, semester } = useParams();
  const navigate = useNavigate();

  const {
    professional_courses,
    completeStudents,
    incompleteStudents,
    externals,
  } = useMemo(() => {
    if (!students?.length)
      return {
        professional_courses: [],
        completeStudents: [],
        incompleteStudents: [],
        externals: [],
      };

    const current_semester = levels[level]?.[semester] || {};
    const course_codes = Object.keys(current_semester);
    const professional_courses = course_codes.filter(
      (code) => code in professionals
    );

    // Create lookup sets for O(1) performance
    const courseCodesSet = new Set(course_codes);

    const completeStudents = [];
    const incompleteStudents = [];
    const externals = [];

    // Sort and process in single pass
    const sortedStudents = [...students].sort((a, b) =>
      a.fullname.localeCompare(b.fullname)
    );

    sortedStudents.forEach((student) => {
      const studentCourseSet = new Set(
        student.courses.map((c) => c.course_code)
      );
      const hasAll = professional_courses.every((code) =>
        studentCourseSet.has(code)
      );

      if (student.courses.length > course_codes.length) {
        externals.push({
          _id: student.student_id,
          fullname: student.fullname,
          reg_no: student.reg_no,
          courses: student.courses.filter(
            (course) => !courseCodesSet.has(course.course_code)
          ),
        });
      }

      if (hasAll) {
        completeStudents.push(student);
      } else {
        incompleteStudents.push(student);
      }
    });

    return {
      professional_courses,
      completeStudents,
      incompleteStudents,
      externals,
    };
  }, [students, level, semester]);

  const gradeLabels = useMemo(() => ["F", "E", "D", "C", "B", "A"], []);

  const handleStudentClick = useCallback(
    (studentId) => {
      navigate(`/admin/student/${studentId}`);
    },
    [navigate]
  );

  const renderResultCell = useCallback(
    (student, code) => {
      const course = student.courses.find((c) => c.course_code === code);
      if (!course) {
        return (
          <td key={code} style={{ textAlign: "center" }}>
            —
          </td>
        );
      }
      return (
        <td key={code} style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span style={{ width: "50%" }}>
              {Number(course.total).toFixed(0)}
            </span>
            <span style={{ fontWeight: "bold", width: "50%" }}>
              {gradeLabels[course.grade]}
            </span>
          </div>
        </td>
      );
    },
    [gradeLabels]
  );

  return (
    <div className="tabl" id="myTable">
      {/* Complete Results (no heading) */}
      {completeStudents.length > 0 && (
        <table>
          <thead>
            <tr>
              <th className="center">S/N</th>
              <th style={{ textAlign: "left" }}>Names</th>
              <th>Reg. No</th>
              {professional_courses.map((code) => (
                <th key={code} className="center">
                  {code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {completeStudents.map((student, i) => (
              <tr key={student._id}>
                <td className="center">{i + 1}</td>
                <td
                  onClick={() => handleStudentClick(student.student_id)}
                  style={{ textAlign: "left" }}
                >
                  {student.fullname}
                </td>
                <td onClick={() => handleStudentClick(student.student_id)}>
                  {student.reg_no}
                </td>
                {professional_courses.map((code) =>
                  renderResultCell(student, code)
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Incomplete Results */}
      {incompleteStudents.length > 0 && (
        <div>
          <h3 className="page_break" style={{ marginLeft: "1rem" }}>
            Incomplete Results
          </h3>
          <table>
            <thead>
              <tr>
                <th className="center">S/N</th>
                <th style={{ textAlign: "left" }}>Names</th>
                <th>Reg. No</th>
                {professional_courses.map((code) => (
                  <th key={code} className="center">
                    {code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {incompleteStudents.map((student, i) => (
                <tr key={student._id}>
                  <td className="center">{i + 1}</td>
                  <td
                    onClick={() => handleStudentClick(student.student_id)}
                    style={{ textAlign: "left" }}
                  >
                    {student.fullname}
                  </td>
                  <td onClick={() => handleStudentClick(student.student_id)}>
                    {student.reg_no}
                  </td>
                  {professional_courses.map((code) =>
                    renderResultCell(student, code)
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Other Courses */}
      {externals.length > 0 && (
        <div>
          <h3 className="page_break" style={{ marginLeft: "1rem" }}>
            Other Courses Results
          </h3>
          <table id="myTable">
            <thead>
              <tr>
                <th className="center">S/N</th>
                <th>Names</th>
                <th>Reg. No</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {externals.map(({ _id, fullname, reg_no, courses }, i) => (
                <tr key={_id}>
                  <td className="center">{i + 1}</td>
                  <td>{fullname}</td>
                  <td>{reg_no}</td>
                  <td>
                    {courses.map((course) => (
                      <div
                        key={course.course_code}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                        }}
                      >
                        <span>{course.course_code}</span>
                        <span style={{ fontWeight: "bold" }}>
                          {Number(course.total).toFixed()}
                        </span>
                        <span
                          style={{
                            fontWeight: "bold",
                            color: course.grade === 0 ? "red" : "black",
                          }}
                        >
                          {["F", "E", "D", "C", "B", "A"][course.grade]}
                        </span>
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default React.memo(Table);
