import React from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";

function Table({ students }) {
  // Sort students alphabetically by fullname
  students.sort((a, b) => a.fullname.localeCompare(b.fullname));

  const { level, semester, session } = useParams();
  const navigate = useNavigate();
  const current_semester = levels[level]?.[semester] || {};
  const course_codes = Object.keys(current_semester);

  return (
    <div className="tabl" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">S/N</th>
            <th style={{ textAlign: "left" }}>Names</th>
            <th>Reg. No</th>
            {course_codes.map((code) => (
              <th key={code} className="center">
                {code}
              </th>
            ))}
            <th className="center">GPA</th>
            {semester === "2" && <th className="center">Session CGPA</th>}
            {semester === "2" && <th className="center">Overall CGPA</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student, i) => (
            <tr key={student._id}>
              <td className="center">{i + 1}</td>
              <td
                onClick={() => navigate(`/admin/student/${student.student_id}`)}
                style={{ textAlign: "left" }}
              >
                {student.fullname}
              </td>
              <td onClick={() => navigate(`/admin/student/${student.student_id}`)}>
                {student.reg_no}
              </td>
              {course_codes.map((code) => {
                const course = student.courses.find(
                  (c) => c.course_code === code
                );
                return (
                  <td key={code} style={{ textAlign: "center" }}>
                    {course ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <span style={{ width: "50%" }}>
                          {Number(course.total).toFixed(0)}
                        </span>
                        <span style={{ fontWeight: "bold", width: "50%" }}>
                          {["F", "E", "D", "C", "B", "A"][course.grade]}
                        </span>
                      </div>
                    ) : null}
                  </td>
                );
              })}
              <td
                className="center"
                style={{
                  fontWeight: "bold",
                }}
              >
                {student?.gpa.toFixed(2)}
              </td>
              {semester === "2" && (
                <>
                  <td
                    className="center"
                    style={{
                      fontWeight: "bold",
                      color: student?.session_gpa < 2.5 ? "red" : "black",
                    }}
                  >
                    {student?.session_gpa?.toFixed(2)}
                  </td>
                  <td className="center" style={{ fontWeight: "bold" }}>
                    {student.cgpa?.toFixed(2)}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* {external_students.length > 0 && (
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
              {external_students.map(({ student, externals }, i) => (
                <tr key={student._id}>
                  <td className="center">{i + 1}</td>
                  <td>{student.fullname}</td>
                  <td>{student.reg_no}</td>
                  <td>
                    {externals.map((course) => (
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
      )} */}
    </div>
  );
}

export default Table;
