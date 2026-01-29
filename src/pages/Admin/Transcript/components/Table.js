import React, { useMemo } from "react";
import professionals from "../../../../data/professionals";
import external from "../../../../data/external";

// Function to check if a course is approved for GPA calculation
const isApprovedCourse = (courseCode) => {
  const code = courseCode.toLowerCase();
  return code in professionals || code in external;
};

// Function to filter approved courses
const filterApprovedCourses = (courses) => {
  return courses?.filter(course => isApprovedCourse(course.course_code)) || [];
};

function Table({
  level,
  first_semester,
  second_semester,
  first_external,
  second_external,
  show,
  transcriptType,
  overall_units,
  overall_gp,
}) {
  const { total_units, total_gp, gradeLabels } = useMemo(() => {
    let total_units = 0, total_gp = 0;
    const gradeLabels = ["F", "E", "D", "C", "B", "A"];
    
    const calculateTotals = (courses) => {
      const approvedCourses = filterApprovedCourses(courses);
      if (approvedCourses.length > 0) {
        approvedCourses.forEach((course) => {
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
      {/* Special handling for 100 level - show all courses in one table */}
      {Number(level) === 100 && (first_external?.length > 0 || second_external?.length > 0) && (
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
          {first_external?.map((course, i) => (
            <tr key={i} style={{ fontSize: "1.5rem" }}>
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
              colSpan={3}
            >
              Second semester
            </th>
          </tr>
          {second_external?.map((course, i) => (
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
        </table>
      )}
      
      {/* Regular handling for other levels */}
      {Number(level) !== 100 && first_semester?.length > 0 && (
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
          {/* Pharmacy courses first semester */}
          {first_semester.map((course, i) => (
            <tr key={i} style={{ fontSize: "1.5rem" }}>
              <td className="center">{i + 1}</td>
              <td>{isApprovedCourse(course.course_code) ? course.course_code : `#${course.course_code}`}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{Number(course.total).toFixed(0)}</td>
              <td>{renderGrade(course.grade)}</td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
          {/* Non-pharmacy courses first semester (for levels other than 600) */}
          {Number(level) !== 600 && first_external?.length > 0 && (
            <tr>
              <th
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "black",
                  padding: "0.3rem",
                  fontSize: "0.9rem",
                  fontStyle: "italic"
                }}
                colSpan={7}
              >
                Non-Pharmacy Courses
              </th>
            </tr>
          )}
          {Number(level) !== 600 && first_external?.map((course, i) => (
            <tr key={`ext1-${i}`} style={{ fontSize: "1.5rem" }}>
              <td className="center">{first_semester.length + i + 1}</td>
              <td>{isApprovedCourse(course.course_code) ? course.course_code : `#${course.course_code}`}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{Number(course.total).toFixed(0)}</td>
              <td>{renderGrade(course.grade)}</td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
          {Number(level) === 600 && (
            <>
              <tr style={{ height: "2rem" }}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr style={{ height: "2rem" }}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr style={{ height: "2rem" }}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </>
          )}
          <tr>
            <th
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "0.5rem",
              }}
              colSpan={3}
            >
              Second semester
            </th>
          </tr>
          {/* Pharmacy courses second semester */}
          {second_semester?.length > 0 &&
            second_semester.map((course, i) => (
              <tr key={i}>
                <td className="center">{i + 1}</td>
                <td>{isApprovedCourse(course.course_code) ? course.course_code : `#${course.course_code}`}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{Number(course.total).toFixed(0)}</td>
                <td>{renderGrade(course.grade)}</td>
                <td>{course.unit_load * course.grade}</td>
              </tr>
            ))}
          {/* Non-pharmacy courses second semester (for levels other than 600) */}
          {Number(level) !== 600 && second_external?.length > 0 && (
            <tr>
              <th
                style={{
                  backgroundColor: "#f8f9fa",
                  color: "black",
                  padding: "0.3rem",
                  fontSize: "0.9rem",
                  fontStyle: "italic"
                }}
                colSpan={7}
              >
                Non-Pharmacy Courses
              </th>
            </tr>
          )}
          {Number(level) !== 600 && second_external?.map((course, i) => (
            <tr key={`ext2-${i}`}>
              <td className="center">{(second_semester?.length || 0) + i + 1}</td>
              <td>{isApprovedCourse(course.course_code) ? course.course_code : `#${course.course_code}`}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{Number(course.total).toFixed(0)}</td>
              <td>{renderGrade(course.grade)}</td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
          {Number(level) === 600 && (
            <>
              <tr style={{ height: "2rem" }}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr style={{ height: "2rem" }}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
              <tr style={{ height: "2rem" }}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            </>
          )}
        </table>
      )}

      {/* Separate non-pharmacy table only for 600 level */}
      {Number(level) === 600 && show && (
        <div>
          <p style={{ paddingLeft: "1rem", fontWeight: "bold" }}>
            {transcriptType === "university"
              ? "non pharmacy courses"
              : "non pharmacy courses"}
          </p>
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
                <td>{isApprovedCourse(course.course_code) ? course.course_code : `#${course.course_code}`}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{Number(course.total).toFixed()}</td>
                <td>{renderGrade(course.grade)}</td>
                <td>{course.unit_load * course.grade}</td>
              </tr>
            ))}
            <tr style={{ height: "2rem" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr style={{ height: "2rem" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr style={{ height: "2rem" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
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
                Second semester
              </th>
            </tr>
            {second_external.map((course, i) => (
              <tr key={i}>
                <td className="center">{i + 1}</td>
                <td>{isApprovedCourse(course.course_code) ? course.course_code : `#${course.course_code}`}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{Number(course.total).toFixed()}</td>
                <td>{renderGrade(course.grade)}</td>
                <td>{course.unit_load * course.grade}</td>
              </tr>
            ))}
            <tr style={{ height: "2rem" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr style={{ height: "2rem" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr style={{ height: "2rem" }}>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </table>
        </div>
      )}

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
          style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}
        >
          <p style={{ marginRight: "0.3rem" }}>
            {Number(level) === 600 ? "cummulative grade point" : "grade point"}:
          </p>
          <h3>
            {Number(level) === 600
              ? overall_units > 0
                ? Number(overall_gp / overall_units).toFixed(2)
                : "0.00"
              : total_units > 0
              ? Number(total_gp / total_units).toFixed(2)
              : "0.00"}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default React.memo(Table);
