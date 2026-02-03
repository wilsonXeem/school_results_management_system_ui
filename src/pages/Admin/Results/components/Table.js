import React, { useMemo, useCallback } from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";

function Table({ students }) {
  const { level, semester } = useParams();
  const navigate = useNavigate();

  const { uploadedCourses, complete_students, incomplete_students, externals } = useMemo(() => {
    if (!students?.length) return { uploadedCourses: [], complete_students: [], incomplete_students: [], externals: [] };
    
    const sortedStudents = [...students];
    
    const current_semester = levels[level]?.[semester] || {};
    const course_codes = Object.keys(current_semester);
    const courseCodesSet = new Set(course_codes);
    
    // Find uploaded courses (at least one student has it)
    const uploadedCourses = course_codes.filter((code) =>
      sortedStudents.some((stud) => stud.courses.some((c) => c.course_code === code))
    );
    const uploadedCoursesSet = new Set(uploadedCourses);
    
    // Single pass categorization
    const complete_students = [];
    const incomplete_students = [];
    const externals = [];
    
    sortedStudents.forEach((student) => {
      const studentCourseSet = new Set(student.courses.map((c) => c.course_code));
      
      // Check completeness
      const hasAllUploaded = uploadedCourses.every((code) => studentCourseSet.has(code));
      const hasMissingCourses = uploadedCourses.some((code) => !studentCourseSet.has(code));
      
      // Check for external courses
      const hasExternalCourses = student.courses.some((c) => !courseCodesSet.has(c.course_code));
      
      if (hasExternalCourses) {
        externals.push({
          _id: student.student_id,
          fullname: student.fullname,
          reg_no: student.reg_no,
          courses: student.courses.filter((course) => !courseCodesSet.has(course.course_code)),
        });
      }
      
      if (hasAllUploaded) {
        complete_students.push(student);
      } else if (hasMissingCourses) {
        incomplete_students.push(student);
      }
    });
    
    return { uploadedCourses, complete_students, incomplete_students, externals };
  }, [students, level, semester]);

  const gradeLabels = useMemo(() => ["F", "E", "D", "C", "B", "A"], []);

  const calculateGpa = useCallback((courses = []) => {
    let totalUnits = 0;
    let totalGp = 0;
    courses.forEach((course) => {
      totalUnits += Number(course.unit_load) || 0;
      totalGp += (Number(course.unit_load) || 0) * (Number(course.grade) || 0);
    });
    const gpa = totalUnits > 0 ? totalGp / totalUnits : 0;
    return { totalUnits, totalGp, gpa };
  }, []);
  
  const handleStudentClick = useCallback((studentId) => {
    navigate(`/admin/student/${studentId}`);
  }, [navigate]);
  
  // Reusable table renderer for complete & incomplete students
  const renderResultTable = useCallback((studentList, title, showHeading = true) => (
    <>
      {showHeading && (
        <h3 style={{ marginLeft: "1rem", marginTop: "2rem" }}>{title}</h3>
      )}
      <table>
        <thead>
          <tr>
            <th className="center">S/N</th>
            <th style={{ textAlign: "left" }}>Names</th>
            <th>Reg. No</th>
            {uploadedCourses.map((code) => (
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
          {studentList.map((student, i) => (
            <tr key={student._id}>
              <td className="center">{i + 1}</td>
              <td
                onClick={() => handleStudentClick(student.student_id)}
                style={{ textAlign: "left", cursor: "pointer" }}
              >
                {student.fullname}
              </td>
              <td
                onClick={() => handleStudentClick(student.student_id)}
                style={{ cursor: "pointer" }}
              >
                {student.reg_no}
              </td>
              {uploadedCourses.map((code) => {
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
                          {gradeLabels[course.grade]}
                        </span>
                      </div>
                    ) : (
                      "" // Leave blank if no result uploaded
                    )}
                  </td>
                );
              })}
              <td className="center" style={{ fontWeight: "bold" }}>
                {calculateGpa(student.courses).gpa.toFixed(2)}
              </td>
              {semester === "2" && (
                <>
                  <td
                    className="center"
                    style={{
                      fontWeight: "bold",
                      color: (student?.session_gpa ?? calculateGpa(student.courses).gpa) < 2.5 ? "red" : "black",
                    }}
                  >
                    {(student?.session_gpa ?? calculateGpa(student.courses).gpa).toFixed(2)}
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
    </>
  ), [uploadedCourses, handleStudentClick, gradeLabels, semester]);

  return (
    <div className="tabl" id="myTable">
      {/* COMPLETE STUDENTS (no heading) */}
      {renderResultTable(complete_students, "", false)}

      {/* INCOMPLETE STUDENTS */}
      {incomplete_students.length > 0 &&
        renderResultTable(incomplete_students, "Incomplete Students")}

      {/* CARRYOVER STUDENTS */}
      {externals.length > 0 && (
        <div>
          <h3 className="page_break" style={{ marginLeft: "1rem" }}>
            Carryover Courses Results
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
                          {gradeLabels[course.grade]}
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
