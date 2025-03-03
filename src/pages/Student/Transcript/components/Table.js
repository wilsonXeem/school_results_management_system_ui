import React from "react";

function Table({
  level,
  first_semester,
  second_semester,
  first_external,
  second_external,
}) {
  return (
    <div class="table trans" style={{ padding: "0rem", marginTop: "1rem" }}>
      {level !== 100 && (
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
          <tr>
            <th
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "0.5rem",
              }}
              colSpan={2}
            >
              first semester
            </th>
          </tr>
          {first_semester.map((course, i) => (
            <tr key={i}>
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
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
          <tr>
            <th
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "0.5rem",
              }}
              colSpan={2}
            >
              Second semester
            </th>
          </tr>
          {second_semester.length > 0 &&
            second_semester.map((course, i) => (
              <tr key={i}>
                <td className="center">{i + 1}</td>
                <td>{course.course_code}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{course.total}</td>
                <td>
                  {course.grade === 5 && <b>A</b>}
                  {course.grade === 4 && <b>B</b>}
                  {course.grade === 3 && <b>C</b>}
                  {course.grade === 2 && <b>D</b>}
                  {course.grade === 1 && <b>E</b>}
                  {course.grade === 0 && <b style={{ color: "red" }}>F</b>}
                </td>
                <td>{course.unit_load * course.grade}</td>
              </tr>
            ))}
        </table>
      )}

      <div>
        {level !== 100 && (
          <p style={{ paddingLeft: "1rem", fontWeight: "bold" }}>
            non-professional courses
          </p>
        )}
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
          <tr>
            <th
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "0.5rem",
              }}
              colSpan={2}
            >
              first semester
            </th>
          </tr>
          {first_external.map((course, i) => (
            <tr key={i}>
              <td className="center">{i + 1}</td>
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{course.total}</td>
              <td>
                {course.grade === 5 && <b>A</b>}
                {course.grade === 4 && <b>B</b>}
                {course.grade === 3 && <b>C</b>}
                {course.grade === 2 && <b>D</b>}
                {course.grade === 1 && <b>E</b>}
                {course.grade === 0 && <b style={{ color: "red" }}>F</b>}
              </td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
          <tr>
            <th
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "0.5rem",
              }}
              colSpan={2}
            >
              Second semester
            </th>
          </tr>
          {second_external.map((course, i) => (
            <tr key={i}>
              <td className="center">{i + 1}</td>
              <td>{course.course_code}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{course.total}</td>
              <td>
                {course.grade === 5 && <b>A</b>}
                {course.grade === 4 && <b>B</b>}
                {course.grade === 3 && <b>C</b>}
                {course.grade === 2 && <b>D</b>}
                {course.grade === 1 && <b>E</b>}
                {course.grade === 0 && <b style={{ color: "red" }}>F</b>}
              </td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}

export default Table;
