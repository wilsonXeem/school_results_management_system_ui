import React, { useMemo } from "react";

function Table({ students }) {
  const sortedStudents = useMemo(() => {
    if (!students?.length) return [];
    return [...students].sort((a, b) => a.fullname.localeCompare(b.fullname));
  }, [students]);

  return (
    <div className="table" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>names</th>
            <th>reg.no</th>
            <th>moe</th>
            <th className="center">current level</th>
            <th>error(s)- session: level: gpa</th>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.length > 0 &&
            sortedStudents.map(
              (student, i) =>
                student && (
                  <tr key={student.student_id || i}>
                    <td className="center">{i + 1}</td>
                    <td>{student.fullname}</td>
                    <td>{student.reg_no}</td>
                    <td>{student.moe}</td>
                    <td className="center">{student.current_level}</td>
                    <td>
                      {student.probation_sessions?.length > 0 &&
                        student.probation_sessions.map((session, j) => (
                          <div key={j} style={{ marginBottom: "0.2rem" }}>
                            <span>{session.session}: </span>
                            <span>{session.level}: </span>
                            <span style={{ color: "red", fontWeight: "bold" }}>
                              {Number(session.gpa).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </td>
                  </tr>
                )
            )}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(Table);
