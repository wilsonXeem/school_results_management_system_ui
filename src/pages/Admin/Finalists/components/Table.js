import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Table({ students, sessions }) {
  const navigate = useNavigate();
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
            {sessions.map((session) => (
              <th key={session} className="center">
                {session}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student, i) => (
            <tr
              key={student.student_id || i}
              onClick={() => navigate(`/admin/student/${student.student_id}`)}
              style={{ cursor: "pointer" }}
            >
              <td className="center">{i + 1}</td>
              <td>{student.fullname}</td>
              <td>{student.reg_no}</td>
              {sessions.map((session) => {
                const issues = student.issues_by_session?.[session] || [];
                return (
                  <td key={session} className="center">
                    {issues.length > 0 &&
                      issues.map((issue, index) => (
                        <div key={`${issue.level}-${index}`}>
                          <span>{issue.level}: </span>
                          <span style={{ color: "red", fontWeight: "bold" }}>
                            {issue.courses
                              .map((course) => course.toUpperCase())
                              .join(", ")}
                          </span>
                        </div>
                      ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(Table);
