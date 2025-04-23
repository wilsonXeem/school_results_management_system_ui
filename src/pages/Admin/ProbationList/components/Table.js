import React from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";

function Table({ students }) {
  students.sort(function (a, b) {
    if (a.fullname < b.fullname) {
      return -1;
    }
    if (a.fullname > b.fullname) {
      return 1;
    }
    return 0;
  });
  const { level, semester, session } = useParams();
  const navigate = useNavigate();

  return (
    <div class="table" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>names</th>
            <th>reg.no</th>
            <th>moe</th>
            {/* {course_codes.map((course_code) => (
              <th className="center">{course_code}</th>
            ))} */}
            {semester == "2" && <th className="center">session cgpa</th>}
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map(
              (student, i) =>
                student && (
                  <tr>
                    <td className="center">{i + 1}</td>
                    <td>{student.fullname}</td>
                    <td>{student.reg_no}</td>
                    <td>{student.moe}</td>
                    {semester == "2" && (
                      <td
                        className="center"
                        style={{
                          fontWeight: "bold",
                          color:
                            Number(student.session_gpa).toFixed(2) < 2.5
                              ? "red"
                              : "black",
                        }}
                      >
                        {Number(student.session_gpa).toFixed(2)}
                      </td>
                    )}
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
