import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Table({ students }) {
  const navigate = useNavigate();
  
  const gradeLabels = useMemo(() => ["F", "E", "D", "C", "B", "A"], []);
  
  const renderGrade = useMemo(() => (grade) => {
    const label = gradeLabels[grade];
    return grade === 0 ? <b style={{ color: "red" }}>{label}</b> : <b>{label}</b>;
  }, [gradeLabels]);
  
  return (
    <div className="course_table">
      <table>
        <thead>
          <tr>
            <th className="center">s/n</th>
            <th>reg. no</th>
            <th>names</th>
            <th className="center">ca</th>
            <th className="center">exam</th>
            <th className="center">total</th>
            <th className="center">grade</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map((student, i) => (
              <tr key={student.student_id || i}>
                <td className="center">{i + 1}</td>
                <td>{student.reg_no}</td>
                <td>{student.fullname}</td>
                <td className="center">{student.ca.toFixed(2)}</td>
                <td className="center">{student.exam.toFixed(2)}</td>
                <td className="center">{student.total.toFixed(2)}</td>
                <td className="center">
                  {renderGrade(student.grade)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default React.memo(Table);
