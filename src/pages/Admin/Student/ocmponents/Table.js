import React, { useMemo } from "react";

function Table({ courses }) {
  const { total_units, total_gp, gradeLabels } = useMemo(() => {
    let total_units = 0, total_gp = 0;
    const gradeLabels = ["F", "E", "D", "C", "B", "A"];
    
    if (courses?.length > 0) {
      courses.forEach((course) => {
        total_units += course.unit_load;
        total_gp += course.unit_load * course.grade;
      });
    }
    
    return { total_units, total_gp, gradeLabels };
  }, [courses]);
  
  const renderGrade = useMemo(() => (grade) => {
    const label = gradeLabels[grade];
    return grade === 0 ? <b style={{ color: "red" }}>{label}</b> : <b>{label}</b>;
  }, [gradeLabels]);
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
          {courses?.length > 0 &&
            courses.map((course, i) => (
              <tr key={course.course_code || i}>
                <td className="center">{i + 1}</td>
                <td>{course.course_code}</td>
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
          <h3>{total_gp}</h3>
        </div>
        <div>
          <p>Total units:</p>
          <h3>{total_units}</h3>
        </div>
      </div>
      <div
        style={{
          textTransform: "uppercase",
          width: "100%",
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <div
          className="total_grade"
          style={{ display: "flex", alignItems: "center", marginRight:"1rem" }}
        >
          <p style={{ marginRight: "0.3rem" }}>cummulative grade point:</p>
          <h3>{total_units > 0 ? Number(total_gp / total_units).toFixed(2) : "0.00"}</h3>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Table);
