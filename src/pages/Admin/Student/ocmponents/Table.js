import React from "react";

function Table({ courses }) {
  let total_units = 0,
    total_gp = 0;

  if (courses.length > 0)
    courses.forEach((course) => {
      total_units += course.unit_load;
      total_gp += course.unit_load * course.grade;
    });
  return (
    <div class="table">
      {/* <p style={{textTransform:"none"}}>Registered courses:</p> */}
      <table>
        <tr>
          <th className="center">s/n</th>
          <th>course code</th>
          <th>course title</th>
          <th>unit</th>
          <th>score</th>
          <th>grade</th>
          <th>gp</th>
        </tr>
        {courses.length > 0 &&
          courses.map((course, i) => (
            <tr>
              <td className="center">{i + 1}</td>
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{Number(course.total).toFixed(0)}</td>
              <td>
                {course.grade === 5 && <b>A</b>}
                {course.grade === 4 && <b>B</b>}
                {course.grade === 3 && <b>C</b>}
                {course.grade === 2 && <b>D</b>}
                {course.grade === 1 && <b>E</b>}
                {course.grade === 0 && <b style={{ color: "red" }}>F</b>}
              </td>
              <td>{course.grade * course.unit_load}</td>
            </tr>
          ))}
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
          class="total_grade"
          style={{ display: "flex", alignItems: "center", marginRight:"1rem" }}
        >
          <p style={{ marginRight: "0.3rem" }}>cummulative grade point:</p>
          <h3>{Number(total_gp / total_units).toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default Table;
