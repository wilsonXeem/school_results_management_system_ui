import React, { useMemo } from "react";

function Table({
  level,
  first_semester,
  second_semester,
  first_external,
  second_external,
  transcriptType,
  overall_units,
  overall_gp,
}) {
  const { total_units, total_gp, gradeLabels } = useMemo(() => {
    let total_units = 0, total_gp = 0;
    const gradeLabels = ["F", "E", "D", "C", "B", "A"];

    const calculateTotals = (courses) => {
      if (courses?.length > 0) {
        courses.forEach((course) => {
          total_units += course.unit_load;
          total_gp += course.unit_load * course.grade;
        });
      }
    };

    calculateTotals(first_semester);
    calculateTotals(second_semester);
    calculateTotals(first_external);
    calculateTotals(second_external);

    return { total_units, total_gp, gradeLabels };
  }, [first_semester, second_semester, first_external, second_external]);

  const renderGrade = useMemo(() => (grade) => {
    const label = gradeLabels[grade];
    return grade === 0 ? <b style={{ color: "red" }}>{label}</b> : <b>{label}</b>;
  }, [gradeLabels]);

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
              <td>{renderGrade(course.grade)}</td>
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
                <td>{renderGrade(course.grade)}</td>
                <td>{course.unit_load * course.grade}</td>
              </tr>
            ))}
        </table>
      )}

      <div>
        {level !== 100 && (
          <p style={{ paddingLeft: "1rem", fontWeight: "bold" }}>
            {transcriptType === "university"
              ? "carry-over courses"
              : "non-professional courses"}
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
              <td>{renderGrade(course.grade)}</td>
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
              <td>{renderGrade(course.grade)}</td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
        </table>
      </div>

      <div
        className="totals"
        style={{ flexDirection: "column", alignItems: "flex-end", gap: "0.25rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>total units:</p>
            <h3>{total_units}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>total grade points:</p>
            <h3>{total_gp}</h3>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>overall units:</p>
            <h3>{overall_units ?? total_units}</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>overall grade points:</p>
            <h3>{overall_gp ?? total_gp}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Table;
