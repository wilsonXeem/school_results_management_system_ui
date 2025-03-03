import React from "react";

function Table({ courses }) {
  return (
    <div class="table" style={{ marginTop: "1rem" }}>
      {/* <p style={{textTransform:"none"}}>Registered courses:</p> */}
      <table>
        <tr>
          <th className="center">s/n</th>
          <th>course code</th>
          <th>course title</th>
          <th>unit</th>
          <th>score</th>
          <th>grade</th>
          <th>total point</th>
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
    </div>
  );
}

export default Table;
