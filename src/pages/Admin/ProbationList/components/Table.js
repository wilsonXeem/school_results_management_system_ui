import React, { useMemo, useCallback } from "react";
import levels from "../../../../data/levels";
import { useParams, useNavigate } from "react-router-dom";

function Table({ students }) {
  const { level, semester, session } = useParams();
  const navigate = useNavigate();
  
  const sortedStudents = useMemo(() => {
    if (!students?.length) return [];
    return [...students].sort((a, b) => a.fullname.localeCompare(b.fullname));
  }, [students]);
  
  const handleStudentClick = useCallback((studentId) => {
    navigate(`/admin/student/${studentId}`);
  }, [navigate]);

  return (
    <div className="table" id="myTable">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>names</th>
            <th>reg.no</th>
            <th>moe</th>
            {semester === "2" && <th className="center">session cgpa</th>}
          </tr>
        </thead>
        <tbody>
          {sortedStudents.length > 0 &&
            sortedStudents.map(
              (student, i) =>
                student && (
                  <tr
                    key={student.student_id || i}
                    onClick={() => handleStudentClick(student.student_id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="center">{i + 1}</td>
                    <td>{student.fullname}</td>
                    <td>{student.reg_no}</td>
                    <td>{student.moe}</td>
                    {semester === "2" && (
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

export default React.memo(Table);
