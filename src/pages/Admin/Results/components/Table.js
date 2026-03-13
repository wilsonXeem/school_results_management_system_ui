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

  const parseNumber = useCallback((value) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }, []);
  
  const handleStudentClick = useCallback((studentId) => {
    navigate(`/admin/student/${studentId}`);
  }, [navigate]);
  
  // Reusable table renderer for complete & incomplete students
  const renderResultTable = useCallback((studentList, title, showHeading = true) => (
    <section className={`results_table_block ${showHeading ? "results_table_block_plain" : ""}`}>
      {showHeading && (
        <h3 className="results_section_title">{title}</h3>
      )}
      <div className="results_table_scroll results_table_scroll_main">
        <table className="results_main_table">
          <thead>
            <tr>
              <th className="center results_col_sn">S/N</th>
              <th className="left results_col_name">Names</th>
              <th className="results_col_reg">Reg. No</th>
              {uploadedCourses.map((code) => (
                <th key={code} className="center results_course_col">
                  {code}
                </th>
              ))}
              <th className="center results_col_gpa">GPA</th>
              {semester === "2" && <th className="center results_col_sgpa">Session CGPA</th>}
              {semester === "2" && <th className="center results_col_ogpa">Overall CGPA</th>}
            </tr>
          </thead>
          <tbody>
            {studentList.map((student, i) => {
              const semesterGpa = parseNumber(student.gpa);
              const sessionGpa = parseNumber(student.session_gpa);
              const overallCgpa = parseNumber(student.cgpa);

              return (
                <tr key={student.student_id || student.reg_no || i}>
                  <td className="center results_col_sn">{i + 1}</td>
                  <td
                    onClick={() => handleStudentClick(student.student_id)}
                    className="results_clickable_cell results_name_cell results_col_name"
                  >
                    {student.fullname}
                  </td>
                  <td
                    onClick={() => handleStudentClick(student.student_id)}
                    className="results_clickable_cell results_reg_cell results_col_reg"
                  >
                    {student.reg_no}
                  </td>
                  {uploadedCourses.map((code) => {
                    const course = student.courses.find(
                      (c) => c.course_code === code
                    );
                    const gradeText = course ? gradeLabels[course.grade] : "";
                    const isFail = gradeText === "F" || Number(course?.grade) === 0;

                    return (
                      <td key={code} className="center results_course_col">
                        {course ? (
                          <div className="results_course_cell">
                            <span className="results_course_total">
                              {Number(course.total).toFixed(0)}
                            </span>
                            <span
                              className={`results_course_grade ${
                                isFail ? "is_fail" : ""
                              }`}
                            >
                              {gradeText}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                  <td className="center results_gpa_cell results_col_gpa">
                    {semesterGpa !== null ? semesterGpa.toFixed(2) : "--"}
                  </td>
                  {semester === "2" && (
                    <>
                      <td
                        className={`center results_gpa_cell ${
                          sessionGpa !== null && sessionGpa < 2.5 ? "is_low" : ""
                        } results_col_sgpa`}
                      >
                        {sessionGpa !== null ? sessionGpa.toFixed(2) : "--"}
                      </td>
                      <td className="center results_gpa_cell results_col_ogpa">
                        {overallCgpa !== null ? overallCgpa.toFixed(2) : "--"}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  ), [uploadedCourses, handleStudentClick, gradeLabels, semester, parseNumber]);

  return (
    <div className="tabl results_table_root" id="myTable">
      {/* COMPLETE STUDENTS (no heading) */}
      {renderResultTable(complete_students, "", false)}

      {/* INCOMPLETE STUDENTS */}
      {incomplete_students.length > 0 &&
        renderResultTable(incomplete_students, "Incomplete Students")}

      {/* CARRYOVER STUDENTS */}
      {externals.length > 0 && (
        <section className="results_table_block results_table_block_plain">
          <h3 className="page_break results_section_title">
            Carryover Courses Results
          </h3>
          <div className="results_table_scroll">
            <table className="results_external_table carryover_table">
              <thead>
                <tr>
                  <th className="center carry_col_sn">S/N</th>
                  <th className="carry_col_name">Names</th>
                  <th className="carry_col_reg">Reg. No</th>
                  <th className="carry_col_courses">Courses</th>
                </tr>
              </thead>
              <tbody>
                {externals.map(({ _id, fullname, reg_no, courses }, i) => (
                  <tr key={_id || reg_no || i}>
                    <td className="center carry_col_sn">{i + 1}</td>
                    <td className="results_name_cell carry_col_name">{fullname}</td>
                    <td className="results_reg_cell carry_col_reg">{reg_no}</td>
                    <td className="carry_col_courses">
                      <div className="results_course_list">
                        {courses.map((course) => {
                          const gradeText = gradeLabels[course.grade];
                          const isFail =
                            gradeText === "F" || Number(course.grade) === 0;
                          return (
                            <div key={course.course_code} className="results_course_list_item">
                              <span className="carry_course_code">{course.course_code}</span>
                              <span className="results_course_total carry_course_total">
                                {Number(course.total).toFixed()}
                              </span>
                              <span
                                className={`results_course_grade carry_course_grade ${
                                  isFail ? "is_fail" : ""
                                }`}
                              >
                                {gradeText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default React.memo(Table);
