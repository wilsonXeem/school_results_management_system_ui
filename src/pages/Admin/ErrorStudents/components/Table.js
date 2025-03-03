import React from "react";

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
  console.log(students)

  return (
    <div class="table" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>names</th>
            <th>reg.no</th>
            <th className="center">current level</th>
            <th>error(s)- session: level: gpa</th>
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
                    <td className="center">{student.current_level}</td>
                    {student.probation_sessions.length > 0 &&
                      student.probation_sessions.map((session, i) => (
                        <tr>
                          <td>{session.session}:</td>
                          <td>{session.level}:</td>
                          <td style={{ color: "red", fontWeight:"bold" }}>
                            {session.gpa}
                          </td>
                        </tr>
                      ))}
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
