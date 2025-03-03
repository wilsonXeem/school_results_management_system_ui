import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Table({ students }) {
  const navigate = useNavigate();
  return (
    <div className="course_table">
      <table>
        <tr>
          <th className="center">s/n</th>
          <th>reg. no</th>
          <th>names</th>
          <th className="center">ca</th>
          <th className="center">exam</th>
          <th className="center">total</th>
          <th className="center">grade</th>
        </tr>
        {students.length > 0 &&
          students.map((student, i) => (
            <tr key={i}>
              <td className="center">{i + 1}</td>
              <td>{student.reg_no}</td>
              <td>{student.fullname}</td>
              <td className="center">{student.ca.toFixed(2)}</td>
              <td className="center">{student.exam.toFixed(2)}</td>
              <td className="center">{student.total.toFixed(2)}</td>
              <td className="center">
                {student.grade === 5 && <b>A</b>}
                {student.grade === 4 && <b>B</b>}
                {student.grade === 3 && <b>C</b>}
                {student.grade === 2 && <b>D</b>}
                {student.grade === 1 && <b>E</b>}
                {student.grade === 0 && <b style={{ color: "red" }}>F</b>}
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
}

export default Table;
