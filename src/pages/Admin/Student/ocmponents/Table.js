import React, { useMemo } from "react";
import professionals from "../../../../data/professionals";
import external_courses from "../../../../data/external_courses";

const isProfessionalCourse = (courseCode = "") => {
  const code = String(courseCode).toLowerCase().trim();
  return Object.prototype.hasOwnProperty.call(professionals, code);
};

const isHashedExternalCourse = (courseCode = "") => {
  const code = String(courseCode).toLowerCase().trim();
  return Object.prototype.hasOwnProperty.call(external_courses, code) && !code.startsWith("hed");
};

const getDisplayCourseCode = (courseCode = "") =>
  isHashedExternalCourse(courseCode) ? `#${courseCode}` : courseCode;

function Table({
  courses,
  semester_gpa,
  total_units,
  total_gp,
}) {
  const { computedUnits, computedGp, gradeLabels, professionalCourses, nonPharmacyCourses } = useMemo(() => {
    let computedUnits = 0;
    let computedGp = 0;
    const gradeLabels = ["F", "E", "D", "C", "B", "A"];
    const professionalCourses = [];
    const nonPharmacyCourses = [];
    
    if (courses?.length > 0) {
      courses.forEach((course) => {
        if (isProfessionalCourse(course?.course_code)) {
          professionalCourses.push(course);
        } else {
          nonPharmacyCourses.push(course);
        }

        const unit = Number(course?.unit_load);
        const grade = Number(course?.grade);
        if (!Number.isFinite(unit) || unit <= 0) return;
        if (isHashedExternalCourse(course?.course_code)) return;
        const safeGrade = Number.isFinite(grade) ? grade : 0;

        computedUnits += unit;
        computedGp += unit * safeGrade;
      });
    }
    
    return { computedUnits, computedGp, gradeLabels, professionalCourses, nonPharmacyCourses };
  }, [courses]);

  const normalizedTotalUnits = useMemo(() => {
    const value = Number(total_units);
    return Number.isFinite(value) && value >= 0 ? value : computedUnits;
  }, [total_units, computedUnits]);

  const normalizedTotalGp = useMemo(() => {
    const value = Number(total_gp);
    return Number.isFinite(value) && value >= 0 ? value : computedGp;
  }, [total_gp, computedGp]);
  
  const renderGrade = useMemo(() => (grade) => {
    const label = gradeLabels[grade];
    return grade === 0 ? <b style={{ color: "red" }}>{label}</b> : <b>{label}</b>;
  }, [gradeLabels]);

  const normalizedSemesterGpa = useMemo(() => {
    const val = Number(semester_gpa);
    if (Number.isFinite(val)) return val;
    return normalizedTotalUnits > 0
      ? Number(normalizedTotalGp / normalizedTotalUnits)
      : 0;
  }, [semester_gpa, normalizedTotalUnits, normalizedTotalGp]);

  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>course code</th>
            <th>course title</th>
            <th>unit</th>
            <th>score</th>
            <th>grade</th>
            <th>gp</th>
          </tr>
        </thead>
        <tbody>
          {professionalCourses.map((course, i) => (
              <tr key={course.course_code || `pro-${i}`}>
                <td className="center">{i + 1}</td>
                <td>{getDisplayCourseCode(course.course_code)}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{Number(course.total).toFixed(0)}</td>
                <td>{renderGrade(course.grade)}</td>
                <td>{course.grade * course.unit_load}</td>
              </tr>
            ))}
          {nonPharmacyCourses.length > 0 && (
            <tr>
              <th
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "black",
                  padding: "0.3rem",
                  fontSize: "0.9rem",
                  fontStyle: "italic",
                }}
                colSpan={7}
              >
                Non-Pharmacy Courses
              </th>
            </tr>
          )}
          {nonPharmacyCourses.map((course, i) => (
              <tr key={course.course_code || i}>
                <td className="center">{professionalCourses.length + i + 1}</td>
                <td>{getDisplayCourseCode(course.course_code)}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{Number(course.total).toFixed(0)}</td>
                <td>{renderGrade(course.grade)}</td>
                <td>{course.grade * course.unit_load}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="totals">
        <div>
          <p>total grade points:</p>
          <h3>{normalizedTotalGp}</h3>
        </div>
        <div>
          <p>Total units:</p>
          <h3>{normalizedTotalUnits}</h3>
        </div>
      </div>
      <div
        style={{
          textTransform: "uppercase",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div
          className="total_grade"
          style={{ display: "flex", alignItems: "center", marginRight:"1rem" }}
        >
          <p style={{ marginRight: "0.3rem" }}>semester grade point:</p>
          <h3>{normalizedSemesterGpa.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Table);
