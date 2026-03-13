import React, { useMemo } from "react";
import external_courses from "../../../../data/external_courses";

const normalizeCourseCode = (courseCode = "") =>
  String(courseCode).toLowerCase().trim();

const isHashedExternalCourse = (courseCode = "") => {
  const code = normalizeCourseCode(courseCode);
  return code in external_courses && !code.startsWith("hed");
};

const getDisplayCourseCode = (courseCode = "") =>
  isHashedExternalCourse(courseCode) ? `#${courseCode}` : courseCode;

const getCourseTotals = (courses = []) => {
  let totalUnits = 0;
  let totalGp = 0;

  (Array.isArray(courses) ? courses : []).forEach((course) => {
    if (isHashedExternalCourse(course?.course_code)) return;
    const unitLoad = Number(course?.unit_load);
    if (!Number.isFinite(unitLoad) || unitLoad <= 0) return;

    const grade = Number(course?.grade);
    const safeGrade = Number.isFinite(grade) ? grade : 0;

    totalUnits += unitLoad;
    totalGp += unitLoad * safeGrade;
  });

  return { totalUnits, totalGp };
};

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
    let total_units = 0;
    let total_gp = 0;
    const gradeLabels = ["F", "E", "D", "C", "B", "A"];

    [first_semester, second_semester, first_external, second_external].forEach(
      (courseGroup) => {
        const { totalUnits, totalGp } = getCourseTotals(courseGroup);
        total_units += totalUnits;
        total_gp += totalGp;
      }
    );

    return { total_units, total_gp, gradeLabels };
  }, [first_semester, second_semester, first_external, second_external]);

  const renderGrade = useMemo(() => (grade) => {
    const label = gradeLabels[grade];
    return grade === 0 ? <b style={{ color: "red" }}>{label}</b> : <b>{label}</b>;
  }, [gradeLabels]);

  const hasAnySessionCourses = useMemo(() => {
    return (
      (first_semester?.length || 0) +
        (second_semester?.length || 0) +
        (first_external?.length || 0) +
        (second_external?.length || 0) >
      0
    );
  }, [first_semester, second_semester, first_external, second_external]);

  const hasNonPharmacyCourses = useMemo(() => {
    return (first_external?.length || 0) + (second_external?.length || 0) > 0;
  }, [first_external, second_external]);

  return (
    <div className="table trans" style={{ padding: "0rem", marginTop: "1rem" }}>
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
            <tr key={i}>
              <td className="center">{i + 1}</td>
              <td>{getDisplayCourseCode(course.course_code)}</td>
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
          {second_external?.map((course, i) => (
            <tr key={i}>
              <td className="center">{i + 1}</td>
              <td>{getDisplayCourseCode(course.course_code)}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{course.total}</td>
              <td>{renderGrade(course.grade)}</td>
              <td>{course.unit_load * course.grade}</td>
            </tr>
          ))}
        </table>
      )}
      
      {/* Regular handling for other levels */}
      {Number(level) !== 100 && hasAnySessionCourses && (
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
            <tr key={i}>
              <td className="center">{i + 1}</td>
              <td>{getDisplayCourseCode(course.course_code)}</td>
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
            <tr key={`ext1-${i}`}>
              <td className="center">{first_semester.length + i + 1}</td>
              <td>{getDisplayCourseCode(course.course_code)}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{course.total}</td>
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
              colSpan={2}
            >
              Second semester
            </th>
          </tr>
          {/* Pharmacy courses second semester */}
          {second_semester.length > 0 &&
            second_semester.map((course, i) => (
              <tr key={i}>
                <td className="center">{i + 1}</td>
                <td>{getDisplayCourseCode(course.course_code)}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{course.total}</td>
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
              <td>{getDisplayCourseCode(course.course_code)}</td>
              <td>{course.course_title}</td>
              <td>{course.unit_load}</td>
              <td>{course.total}</td>
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
      {Number(level) === 600 && hasNonPharmacyCourses && (
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
                <td>{getDisplayCourseCode(course.course_code)}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{course.total}</td>
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
                <td>{getDisplayCourseCode(course.course_code)}</td>
                <td>{course.course_title}</td>
                <td>{course.unit_load}</td>
                <td>{course.total}</td>
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
    </div>
  );
}

export default Table;
